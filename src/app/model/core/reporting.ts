/**
 * The smallest atom of provided data.
 */
export class ReportedData {
  sourceName?: string;
  y?: number;

  constructor(obj = {} as ReportedData) {
    let {
      sourceName = "",
      y = 0
    } = obj;
    this.sourceName = sourceName;
    this.y = y;
  }
}

/**
 * Interface to provide data to a @class{Report}.
 */
export interface Reporter {

  /**
   * Implement this method to register all available data providers to the
   * specified data processor.
   * At the very least, it should register itself.
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void;

  /**
   * Receives notification that a new reporting cycle starts,
   * at the specified instant.
   * @param {Date} instant The date to report.
   */
  startReportingCycle(instant: Date): void;

  /**
   * Reports to the specified data processor.
   * @param {Report} report The data processor
   * to report.
   */
  reportTo(report: Report): void;
}

/**
 * Interface to receive data produced by @class{Reporter}.
 */
export interface Report {
  /**
   * Registers a reporter to this data processor.
   * @param {Reporter} reporter The reporter to register.
   */
  register(reporter: Reporter):void;

  /**
   * A data processor can receive data provided by a reporter.
   * @param {ReportedData} providedData The provided data.
   */
  receiveData(providedData: ReportedData):void;

  /**
   * Start a new reporting cycle.
   * @param {Date} instant As reports are instant based, the instant of this reporting cycle.
   */
  startReportingCycle(instant: Date): void;

  /**
   * Collect reports from all reporters.
   */
  collectReports(): void;

  /**
   * The report is finished.
   */
   completeReport(): void;
}

/**
 * A data processor that does absolutely nothing, to have as default
 * value to avoid null pointer exceptions.
 */
export class NullReport implements Report {
  startReportingCycle(instant: Date): void {
    // Let's do nothing.
  }

  collectReports(): void {
    // Let's do nothing.
  }

  register(reporter: Reporter): void {
    // Let's do nothing.
  }

  receiveData(): void {
    // Let's do nothing.
  }

  completeReport(): void {
    // Let's do nothing.
  }
}

/**
 * A preprocessor is a report that reports to a higher report.
 */
export interface PreProcessor {
  /**
   * Start a new reporting cycle.
   * @param {Date} instant As reports are instant based, the instant of this reporting cycle.
   */
  startReportingCycle(instant: Date): void;

  /**
   * A data processor can receive data provided by a reporter.
   * @param {ReportedData} providedData The provided data.
   */
  receiveData(providedData: ReportedData):void;

  /**
   * Reports to the specified data processor.
   * @param {Report} report The data processor
   * to report.
   */
  reportTo(report: Report): void;
}
