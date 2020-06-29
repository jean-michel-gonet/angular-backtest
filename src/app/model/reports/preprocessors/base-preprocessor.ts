import { Report, PreProcessor, ReportedData } from '../../core/reporting';
import { UnitOfTime, UnitsOfTime } from './unit-of-time';

export interface IBasePreprocessor {
  source: string;
  over: number;
  unitOfTime: UnitOfTime;
  output: string;
}

export abstract class Record {
  constructor(public endDate: Date) {}
  abstract getValue(): number;
  abstract compute(instant: Date, y: number): void;
}

export abstract class BasePreprocessor implements PreProcessor {
  source: string;
  unitsOfTime: UnitsOfTime;
  output: string;

  private instant: Date;
  private records: Record[] = [];

  constructor(obj = {} as IBasePreprocessor) {
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

  abstract makeNewRecord(endDate: Date): Record;

  reportTo(report: Report): void {
    if (this.records.length > 0) {
      let record: Record;

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
