import * as moment from 'moment';
import * as hash from 'object-hash';
import { AsyncCompletionFunction } from 'yargs';

export interface ITrade {
  amount: number;
  id: string;
  price: number;
  timestamp: number;
  _id?: string;
}

export class Trade {
  public amount: number;
  public id: string;
  public price: number;
  public timestamp: number;
  public _id?: string;
  public _moment?: moment.Moment;

  constructor(args: ITrade) {
    this.amount = args.amount;
    this._id = args._id ? args._id : hash(args);
    this.price = args.price;
    this.timestamp = args.timestamp;
    this.id = args.id;
    this._moment = moment(this.timestamp).utc();
  }

  public strip() {
    return {
      _id: this._id,
      amount: this.amount,
      id: this.id,
      price: this.price,
      timestamp: this.timestamp,
    };
  }
}
