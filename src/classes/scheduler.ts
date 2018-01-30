import * as later from 'later';
import * as moment from 'moment';

export class Scheduler {
  private _startTimestamp: moment.Moment;
  private _lastTimestamp: moment.Moment;
  private _schedule: later.ScheduleData;
  private _occurences: later.Schedule;
  private _timer: later.Timer;

  constructor(private _later: string) {
    this._schedule = later.parse.text(this._later);
    this._occurences = later.schedule(this._schedule);
  }

  get startTimestamp() {
    return this._startTimestamp;
  }
  set startTimestamp(start) {
    this._startTimestamp = start;
  }

  get lastTimestamp() {
    return this._lastTimestamp;
  }
  set lastTimestamp(last) {
    this._lastTimestamp = last;
  }

  public async start(job: () => Promise<any>) {
    try {
      this.startTimestamp = moment().utc();
      this.lastTimestamp = moment().utc();
      await job();
      this._timer = later.setInterval(() => {
        this.lastTimestamp = moment().utc();
        job();
      }, this._schedule);
    } catch (err) {
      throw err;
    }
  }

  public stop() {
    this._timer.clear();
  }
}
