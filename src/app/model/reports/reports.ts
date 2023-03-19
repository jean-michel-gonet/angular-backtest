import { Report, Reporter, ReportedData } from '../core/reporting';
import { PreProcessor } from './preprocessors/preprocessor';

interface IReports {
  /**
   * List of reports to be contained.
   */
  reports: Report[];

  /**
   * List of pre-processors to be contained.
   */
  preProcessors: PreProcessor[];
}

/**
 * A report that can hold multiple report and behave as one.
 * It also can hold pre-processors, passing their data to the registered
 * reports automatically.
 */
export class Reports implements Report, Reporter {
  reports: Report[];
  preProcessors: PreProcessor[];
  reporters: Reporter[] = [];
  reportedData: ReportedData[];

  constructor(obj = {} as IReports) {
    let {
      reports = [],
      preProcessors = []
    } = obj;
    this.reports = reports;
    this.preProcessors = preProcessors;

    // For child reports, this is the reporter:
    this.reports.forEach(r => {
      r.register(this)
    });
  }

  /**
   * Adds pre-processors to those already configured.
   * @param preProcessor An additional pre-processor.
   */
  registerPreProcessor(preProcessor: PreProcessor): void {
    this.preProcessors.push(preProcessor);
  }

  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  doRegister(): void {
    throw new Error("Method not implemented.");
  }

  private reportingCycleInProgress: boolean = false;

  startReportingCycle(instant: Date): void {
    if (!this.reportingCycleInProgress) {
      this.reportingCycleInProgress = true;
      this.reports.forEach(r => {
        r.startReportingCycle(instant)
      });
      this.preProcessors.forEach(p => {
        p.startReportingCycle(instant);
      });
      this.reporters.forEach(r => {
        r.startReportingCycle(instant);
      })
      this.reportingCycleInProgress = false;
    }
  }

  collectReports(): void {
    this.reportedData = [];

    this.reporters.forEach(r => {
      r.reportTo(this);
    });
    this.preProcessors.forEach(p =>  {
      p.reportTo(this);
    });
    this.reports.forEach(r => {
      r.collectReports();
    })
  }

  receiveData(providedData: ReportedData): void {
    this.preProcessors.forEach(p => {
      p.receiveData(providedData);
    });
    this.reportedData.push(providedData);
  }

  reportTo(report: Report): void {
    this.reportedData.forEach(r => {
      report.receiveData(r);
    });
  }

  completeReport(): void {
    this.reports.forEach(r => {
      r.completeReport();
    });
  }

  listQuotesOfInterest(): string[] {
    let quotesOfInterest: string[] = [];
    this.reports.forEach(r => {
      quotesOfInterest = quotesOfInterest.concat(r.listQuotesOfInterest());
    });
    this.preProcessors.forEach(p => {
      quotesOfInterest = quotesOfInterest.concat(p.listQuotesOfInterest());
    });
    return quotesOfInterest;
  }
}
