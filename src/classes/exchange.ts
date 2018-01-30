import * as querystring from 'querystring';
import * as superagent from 'superagent';
import { Trade } from '../classes';

export interface IExchangeApiPath {
  path: string;
  interval: string;
  limit?: number;
}

export interface IExchangeApi {
  endpoint: string;
  fetchTrades: IExchangeApiPath;
}

export interface IExchangeConfig {
  id: string;
  api: IExchangeApi;
}

export abstract class Exchange {
  constructor(private _config: IExchangeConfig) {}

  get config() {
    return this._config;
  }

  public abstract async fetchTrades(
    symbol: string,
    params?: any
  ): Promise<Trade[]>;
  /*
  public abstract async importTrades(
    symbol: string,
    params: {
      start: number;
    }
  ): Promise<Trade[]>;
  */
}
