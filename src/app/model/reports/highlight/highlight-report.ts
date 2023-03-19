import { Report, Reporter, ReportedData } from 'src/app/model/core/reporting';
import { QuotesOfInterest } from '../../core/quotes';

export interface Highlight extends QuotesOfInterest {
  startReportingCycle(instant: Date): void;
  receiveData(providedData: ReportedData): void;
  completeReport(): void;
}

export class HighlightReport implements Report {
  private highlights: Highlight[];
  private reporters: Reporter[] = [];

  constructor(highlights: Highlight[] = []) {
    this.initialize(highlights);
  }

  initialize(highlights: Highlight[]) {
    this.highlights = highlights;
  }

  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  startReportingCycle(instant: Date): void {
    this.highlights.forEach(h => {
      h.startReportingCycle(instant);
    });
  }

  receiveData(providedData: ReportedData): void {
    this.highlights.forEach(h => {
      h.receiveData(providedData);
    });
  }

  collectReports(): void {
    this.reporters.forEach(r => {
      r.reportTo(this);
    });
  }
  completeReport(): void {
    this.highlights.forEach(h => {
      h.completeReport();
    });
  }
  listQuotesOfInterest(): string[] {
    let quotesOfInterest: string[] = [];
    this.highlights.forEach(h => {
      quotesOfInterest = quotesOfInterest.concat(h.listQuotesOfInterest());
    });
    return quotesOfInterest;
  }
}
