import * as joi from 'joi';

export interface IExchangeConfig {
  id: string;
  key: string;
  secret: string;
}

export interface ITradePair {
  asset: string;
  currency: string;
}

export abstract class Exchange {
  public static _configSchema = joi.object().keys({
    id: joi
      .string()
      .min(1)
      .required(),
    key: joi
      .string()
      .min(1)
      .required(),
    secret: joi
      .string()
      .min(1)
      .required(),
  });

  protected _tradePairs: ITradePair[];

  constructor(private _config: IExchangeConfig) {}

  get config() {
    return this._config;
  }

  set config(config) {
    const result = joi.validate(config, Exchange._configSchema);
    if (result.error) {
      throw result.error;
    }
    this._config = result.value;
  }

  public abstract async fetchTradePairs(): Promise<ITradePair[]>;
}
