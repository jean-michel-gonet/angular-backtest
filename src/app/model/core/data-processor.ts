/**
 * The smallest atom of provided data.
 */
export class ProvidedData {
  sourceName?: string;
  time?: Date;
  y?: number;

  constructor(obj = {} as ProvidedData) {
    let {
      sourceName = "",
      time = new Date(),
      y = 0
    } = obj;
    this.sourceName = sourceName;
    this.time = time;
    this.y = y;
  }
}

/**
 * Interface to provide data to a @class{DataProcessor}.
 */
export interface DataProvider {

  /**
   * Accepts the visit of a data processor,
   * and guides it through the hierarchy.
   * At the very least, makes it visit this instance.
   * @param {DataProcessor} dataProcessor The data processor.
   */
  accept(dataProcessor: DataProcessor): void;

  /**
   * Receives notification that a new reporting cycle starts,
   * at the specified time.
   * @param {Date} time The date to report.
   */
  startReportingCycle(time: Date): void;

  /**
   * Reports to a data processor.
   * @param {DataProcessor} dataProcessor The data processor
   * to report.
   */
  report(dataProcessor: DataProcessor): void;
}

/**
 * Interface to receive data produced by @class{DataProvider}.
 */
export interface DataProcessor {
  /**
   * Visits a data provider.
   */
  visit(dataProvider: DataProvider):void;

  /**
   * A data processor can receive data provided by a data provider.
   * @param {ProvidedData} providedData The provided data.
   */
  receiveData(providedData: ProvidedData):void;

  /**
   * Start a new reporting cycle.
   */
  startReportingCycle(time: Date): void;

  /**
   * Collect reports from all data providers.
   */
  collectReports(): void;
}

/**
 * A data processor that does absolutely nothing, to have as default
 * value to avoid null pointer exceptions.
 */
export class NullDataProcessor implements DataProcessor {

  startReportingCycle(time: Date): void {
    // Let's do nothing.
  }

  collectReports(): void {
    // Let's do nothing.
  }

  visit(dataProvider: DataProvider): void {
    // Let's do nothing.
  }

  receiveData(): void {
    // Let's do nothing.
  }
}
