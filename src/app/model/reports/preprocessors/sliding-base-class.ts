import { Report, PreProcessor, ReportedData } from '../../core/reporting';
import { UnitOfTime, UnitsOfTime } from './unit-of-time';

export interface ISlidingBase {
  source: string;
  over: number;
  unitOfTime: UnitOfTime;
  output: string;
}

export abstract class SlidingRecord {
  constructor(public endDate: Date) {}
  abstract getValue(): number;
  abstract compute(instant: Date, y: number): void;
}

export abstract class SlidingBase implements PreProcessor {
  source: string;
  unitsOfTime: UnitsOfTime;
  output: string;

  private instant: Date;
  private records: SlidingRecord[] = [];

  constructor(obj = {} as ISlidingBase) {
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
      let endDate: Date = this.unitsOfTime.startingFrom(this.instant);
      this.records.push(this.makeNewRecord(endDate));
      this.records.forEach(r => {
        r.compute(this.instant, providedData.y);
      });
    }
  }

  abstract makeNewRecord(endDate: Date): SlidingRecord;

  reportTo(report: Report): void {
    if (this.records.length > 0) {
      let record: SlidingRecord;

      while (this.records[0].endDate <= this.instant) {
        record = this.records.shift();
      }
      if (record) {
        let y: number = record.getValue();
        report.receiveData(new ReportedData({sourceName: this.output, y: y}));
      }
    }
  }
}
