/*
import * as moment from 'moment';
import * as querystring from 'querystring';
import * as superagent from 'superagent';
import { Exchange, IExchangeConfig, Trade } from '../../classes';

export class Binance extends Exchange {
  public static config: IExchangeConfig = {
    api: {
      endpoint: 'https://api.binance.com',
      fetchTrades: {
        interval: 'every 3 minutes',
        limit: 500,
        path: '/api/v1/aggTrades',
      },
    },
    id: 'binance',
  };

  private _id: string;

  constructor() {
    super(Binance.config);
    this.id = 'binance';
  }

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }

  public async fetchTrades(symbol: string, params = {}) {
    try {
      const mParams = { limit: this.config.api.fetchTrades.limit, ...params };
      const url = `${this.config.api.endpoint}${
        this.config.api.fetchTrades.path
      }?symbol=${symbol}&${querystring.stringify(mParams)}`;
      const response = await superagent.get(url);
      return response.body.map((trade: any) => {
        return new Trade({
          amount: trade.q,
          id: trade.a,
          price: trade.p,
          timestamp: trade.T,
        });
      });
    } catch (err) {
      throw err;
    }
  }
}
*/
