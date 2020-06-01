import { Report, PreProcessor, ReportedData } from '../../core/reporting';
import { UnitOfTime, UnitsOfTime } from '../../core/unit-of-time';

interface ISlidingPerformance {
  source: string;
  over: number;
  unitOfTime: UnitOfTime;
  output: string;
}

class Record {
  constructor(public startDate: Date, public initialValue: number, public endDate: Date) {}
}

export class SlidingPerformance implements PreProcessor {
  source: string;
  unitsOfTime: UnitsOfTime;
  output: string;

  private instant: Date;
  private y: number;
  private records: Record[] = [];

  constructor(obj = {} as ISlidingPerformance) {
    let {
      source,
      over,
      unitOfTime,
      output
    } = obj;
    this.source = source;
    this.unitsOfTime = new UnitsOfTime(over, unitOfTime);
    this.output = output;
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.source) {
      this.records.push(new Record(
        new Date(this.instant.valueOf()),
        providedData.y,
        this.unitsOfTime.startingFrom(this.instant)));
      this.y = providedData.y;
    }
  }

  reportTo(report: Report): void {
    let record: Record;

    while (this.records[0].endDate <= this.instant) {
      record = this.records.shift();
    }
    if (record) {
      let variation: number = this.y - record.initialValue;
      let performance: number = 100 * variation / record.initialValue;
      let days: number = (this.instant.valueOf() - record.startDate.valueOf()) / (24 * 60 * 60 * 1000);
      let annualPerformance: number = performance * 365 / days;
      report.receiveData(new ReportedData({sourceName: this.output, y: annualPerformance}));
    }
  }
}