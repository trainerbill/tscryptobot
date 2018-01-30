import * as moment from 'moment';
import { Exchange } from './exchange';
import { TradeFetcher } from './tradeFetcher';

export class TradeImporter extends TradeFetcher {
  private _startTime: moment.Moment;

  constructor(
    _exchange: Exchange,
    _asset: string,
    _currency: string,
    startTime: string
  ) {
    super(_exchange, _asset, _currency);
    this.startTime = startTime;
  }

  get startTime() {
    return this._startTime;
  }

  set startTime(time: any) {
    this._startTime = moment(time).utc();
  }
}
