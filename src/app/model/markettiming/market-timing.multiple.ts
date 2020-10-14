import { MarketTiming, BearBull } from '../core/market-timing';
import { InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';

class ChangeOfStatus {
  id: string;
  status: BearBull;
}

export class MultipleMarketTiming implements MarketTiming {
  private previousStatus:Map<number, BearBull> = new Map();
  private changeOfStatus: ChangeOfStatus[] = [];
  public id: string = "";

  constructor(public marketTimings: MarketTiming[]) {}

  record(instantQuotes: InstantQuotes): void {
    this.marketTimings.forEach(m => {
      m.record(instantQuotes);
    });
  }

  bearBull(): BearBull {
    let n: number = 0;
    this.marketTimings.forEach(m => {
      let s = m.bearBull();
      let p = this.previousStatus.get(++n);
      if (s != p) {
        this.changeOfStatus.push({id: m.id, status: s});
      }
      this.previousStatus.set(n, m.bearBull());
    })

    let response: BearBull = BearBull.BULL;
    this.previousStatus.forEach((value:BearBull, key: number) => {
      if (value == BearBull.BEAR) {
        response = BearBull.BEAR;
      }
    });

    return response;
  }

  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    this.marketTimings.forEach(m => {
      m.startReportingCycle(instant);
    });
  }

  reportTo(report: Report): void {
    this.marketTimings.forEach(m => {
      m.reportTo(report);
    });
    this.changeOfStatus = this.changeOfStatus.filter(c =>{
      report.receiveData(new ReportedData({
        sourceName: c.id + "." + c.status
      }))
      return false;
    });
  }
}
