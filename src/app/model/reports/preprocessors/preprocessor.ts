import { Report, ReportedData } from "../../core/reporting";

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
  