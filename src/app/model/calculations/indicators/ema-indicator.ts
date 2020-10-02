import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { ExponentialMovingAverage } from '../moving-average/exponential-moving-average';
import { IndicatorConfiguration } from './configurable-source';

/**
 * Calculates the Exponential Moving Average of the quotes provided
 * along time.
 * For example, suppose we calculate an EMA over 12 months. You need
 * to specify the following values to the constructor:
 * <dl>
 *  <dt>Number of periods</dt><dd>That will be 12</dd>
 *  <dt>Period length</dt><dd>That will be MONTHLY</dd>
 * </dl>
 * Then you can call {@link ema} once for every simulated day, providing
 * the instant and the corresponding quote. The calculation will return
 * {@code undefined} most of the time, except when there is a change of
 * period. In this case, the first day of each month.
 */
export class EmaIndicator extends ConfigurableSourceIndicator {

  public exponential: ExponentialMovingAverage;

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   * @param {PeriodLength} periodLength The period period length.
   */
  constructor(obj = {} as IndicatorConfiguration) {
    super(obj);
    this.exponential = new ExponentialMovingAverage(this.numberOfPeriods);
  }

  /**
   * Performs the EMA calculation.
   * @param {number} value The value.
   * @return {number} The EMA for this and all previously provided values.
   */
  protected compute(value: number): number {
    return this.exponential.movingAverageOf(value);
  }

  /**
   * Force the last EMA value.
   * A method useful for unit testing, for example.
   * @param {number} value The forced last ema value.
   */
  setLastValue(value: number): void  {
    this.exponential.setPreviousAverage(value);
  }
}
