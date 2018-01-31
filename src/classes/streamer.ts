import * as later from 'later';
import * as moment from 'moment';
import * as winston from 'winston';
import * as WebSocket from 'ws';

export class Streamer {
  private _ws: WebSocket;
  private _connected: moment.Moment;
  private _lastReceived: moment.Moment;

  constructor(
    private _url: string,
    private _dataReceiver: (data: any) => Promise<any>
  ) {
    this._ws = new WebSocket(this._url);
    this._ws.on('open', () => {
      this._connected = moment();
      winston.info(`${this._url} websocket conneccted.`);
    });

    this._ws.on('message', data => {
      winston.silly(`${this._url} data received`, data);
      this._lastReceived = moment();
      this._dataReceiver(data);
    });
  }
}
