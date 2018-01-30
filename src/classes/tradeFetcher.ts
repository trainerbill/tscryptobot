import { sortBy } from 'lodash';
import * as lowdb from 'lowdb';
// tslint:disable-next-line:no-submodule-imports
import * as FileSync from 'lowdb/adapters/FileSync';
import * as moment from 'moment';
import * as path from 'path';
import { Scheduler, Trade } from '../classes';
import { Exchange } from './exchange';

export class TradeFetcher extends Scheduler {
  private _symbol: string;
  private _adapter: lowdb.Adapter;
  private _db: lowdb.Lowdb<{}, lowdb.Adapter>;
  private _trades: Trade[];

  constructor(
    private _exchange: Exchange,
    private _asset: string,
    private _currency: string
  ) {
    super(_exchange.config.api.fetchTrades.interval);
    this.symbol = `${this.asset}${this.currency}`;
    this._adapter = new FileSync(
      path.resolve(
        `data/${this.exchange.config.id}_${this.asset}_${this.currency}.json`
      )
    );
    this._db = lowdb(this._adapter);
    if (!this._db.get('trades').value()) {
      this._trades = [];
      this._db
        .set('id', this.exchange.config.id)
        .set('trades', [])
        .write();
    } else {
      this._trades = this._db
        .get('last')
        .map(last => (this.lastTimestamp = moment(last)))
        .get('trades')
        .map((trade: Trade) => new Trade(trade))
        .value();
    }
  }

  get symbol() {
    return this._symbol;
  }
  set symbol(symbol) {
    this._symbol = symbol;
  }

  get asset() {
    return this._asset;
  }
  set asset(asset) {
    this._asset = asset;
  }

  get currency() {
    return this._currency;
  }
  set currency(currency) {
    this._currency = currency;
  }

  get exchange() {
    return this._exchange;
  }
  set exchange(exchange) {
    this._exchange = exchange;
  }

  public async start(params = {}) {
    super.start(async () => {
      try {
        const trades = await this.exchange.fetchTrades(this.symbol, params);
        trades.forEach(trade => {
          const filtered = this._trades.filter(
            ftrade => ftrade._id === trade._id
          );
          if (filtered.length > 0) {
            return;
          }
          this._trades.push(trade);
        });

        this._db
          .set('last', this.lastTimestamp.unix())
          .set('trades', sortBy(this._trades, trade => trade.timestamp))
          .set('trades', this._trades.map(trade => trade.strip()))
          .write();
      } catch (err) {
        throw err;
      }
    });
  }
}
