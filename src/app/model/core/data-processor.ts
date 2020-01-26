
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
   * A data provider can provide data to the specified data processor.
   * @param {DataProcessor} dataProcessor The data processor.
   */
  provideData(dataProcessor: DataProcessor):void;
}

/**
 * A data processor that does absolutely nothing, to have as default
 * value to avoid null pointer exceptions.
 */
export class NullDataProcessor implements DataProcessor {
  receiveData(): void {
    // Let's do nothing.
  }
}

/**
 * Interface to receive data produced by @class{DataProvider}.
 */
export interface DataProcessor {
  /**
   * A data processor can receive data provided by a data provider.
   * @param {ProvidedData} providedData The provided data.
   */
  receiveData(providedData: ProvidedData):void;
}
