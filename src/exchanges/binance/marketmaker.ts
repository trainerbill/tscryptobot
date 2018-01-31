import { NewOrder, Order } from 'binance-api-node';
import * as winston from 'winston';
import { MarketMaker } from '../../classes';
import { BinanceExchange, IBinance } from './binance';

export class BinanceMarketMaker extends MarketMaker {
  private _exchange: BinanceExchange;
  private _orderbookWs: any;
  private _tradesWs: any;

  constructor(
    private _asset: string,
    private _currency: string,
    private _depth: number
  ) {
    super(BinanceExchange.symbolMaker(_asset, _currency));

    this._exchange = new BinanceExchange();
  }

  public async init() {
    try {
      await this._exchange.init();
      // TODO: Fix this when openOrders is added to typedef
      const orders = await (this._exchange.private as IBinance).openOrders!(
        this._symbol
      );
      const promises = orders.map(order =>
        (this._exchange.private as IBinance).cancelOrder!(
          order.symbol,
          order.orderId
        )
      );
      await Promise.all([
        ...promises,
        this.startTradesStream(),
        this.startOrderBookStream(),
      ]);
    } catch (err) {
      winston.error(err);
    }
  }

  protected async createBuy(price: string, quantity: string) {
    return this._exchange.private.order({
      price,
      quantity,
      side: 'BUY',
      symbol: this._symbol,
      type: 'LIMIT_MAKER',
    });
  }

  protected async createSell(price: string, quantity: string) {
    return this._exchange.private.order({
      price,
      quantity,
      side: 'SELL',
      symbol: this._symbol,
      type: 'LIMIT_MAKER',
    });
  }

  protected async startOrderBookStream() {
    super.startOrderBookStream();
    this._orderbookWs = this._exchange.public.ws.partialDepth(
      { symbol: this._symbol, level: 20 },
      data => {
        winston.silly(`OrderBookData: ${JSON.stringify(data)}`);
      }
    );
  }

  protected async startTradesStream() {
    super.startTradesStream();
    this._tradesWs = this._exchange.public.ws.trades([this._symbol], data => {
      winston.silly(`TradeData: ${JSON.stringify(data)}`);
    });
  }
}
