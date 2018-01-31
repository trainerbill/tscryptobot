import { Binance, default as binance, Order } from 'binance-api-node';
import * as joi from 'joi';
import * as winston from 'winston';
import { Exchange, ITradePair } from '../../classes';

export interface IBinance extends Binance {
  openOrders?: (symbol: string) => Promise<Order[]>;
  cancelOrder?: (symbol: string, id: number) => Promise<any>;
}

export class BinanceExchange extends Exchange {
  public static currencies = ['BTC', 'ETH', 'BNB', 'USDT'];

  public static symbolDestruct(symbol: string) {
    const currencyReg = new RegExp(
      `\\w+(${BinanceExchange.currencies.join('|')})$`
    );
    const result = symbol.match(currencyReg);
    const currency = result ? result[1] : null;

    if (!currency) {
      winston.warn(`Cannot destruct symbol ${symbol}`);
      return;
    }
    const asset = symbol.slice(0, symbol.indexOf(currency));
    return {
      asset,
      currency,
    };
  }

  public static symbolMaker(asset: string, currency: string) {
    return asset + currency;
  }

  private _public: Binance;
  private _private: Binance;

  constructor() {
    super({
      id: 'binance',
      key: process.env.BINANCE_KEY || '',
      secret: process.env.BINANCE_SECRET || '',
    });

    this._public = binance();
    this._private = binance({
      apiKey: this.config.key,
      apiSecret: this.config.secret,
    });
    // TODO: This may be a problem since its async.  May need to figure out an init process.
  }

  get public() {
    return this._public;
  }

  get private() {
    return this._private;
  }

  public async init() {
    return this.fetchTradePairs();
  }

  public async fetchTradePairs() {
    try {
      const prices = await this._public.prices();

      this._tradePairs = Object.keys(prices).reduce(
        (result: ITradePair[], ticker: any) => {
          const tp = BinanceExchange.symbolDestruct(ticker);
          if (tp) {
            result.push(tp);
          }
          return result;
        },
        []
      );

      return this._tradePairs;
    } catch (err) {
      throw err;
    }
  }
}
