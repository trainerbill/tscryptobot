import * as moment from 'moment';

export abstract class MarketMaker {
  protected _orderbook = [];
  protected _buys: any[] = [];
  protected _sells: any[] = [];
  protected _orderbookStreamMoment: moment.Moment;
  protected _tradesStreamMoment: moment.Moment;

  constructor(protected _symbol: string) {}

  protected abstract async createSell(
    price: string,
    quantity: string
  ): Promise<any>;
  protected abstract async createBuy(
    price: string,
    quantity: string
  ): Promise<any>;

  protected startOrderBookStream() {
    this._orderbookStreamMoment = moment();
  }

  protected startTradesStream() {
    this._tradesStreamMoment = moment();
  }
}
