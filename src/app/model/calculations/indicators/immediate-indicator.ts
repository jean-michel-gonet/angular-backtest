import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';

/**
 * Returns the immediate value of the configured source.
 */
export class ImmediateIndicator extends ConfigurableSourceIndicator {

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   * @param {Periodicity} periodicity The period period length.
   */
  constructor(obj = {} as IndicatorConfiguration) {
    super(obj);
  }

  /**
   * Performs the EMA calculation.
   * @param {Date} instant The instant (not used).
   * @param {number} value The value.
   * @return {number} The EMA for this and all previously provided values.
   */
  protected compute(instant: Date, value: number): number {
    return value;
  }
}
