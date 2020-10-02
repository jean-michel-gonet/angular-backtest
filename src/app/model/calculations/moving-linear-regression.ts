import { OnlineLinearRegression } from './online-linear-regression';
import { IMovingCalculator } from './indicators/configurable-source';
import { ConfigurableSourceIndicator } from './indicators/configurable-source-indicator';

const MILLISECONDS_IN_A_YEAR: number = 1000 * 24 * 60 * 60 * 365;

/**
 * Calculates the linear regression over
 * the specified number of periods.
 * Linear regression is calculated in annual rate vs days.
 * @class {MovingLinearRegression}
 */
export class MovingLinearRegression extends ConfigurableSourceIndicator {
  private instantValues: {instant: Date, value: number}[] = [];

  constructor(obj = {} as IMovingCalculator) {
    super(obj);
  }

  protected compute(instant: Date, value: number): number {
    this.instantValues.push({instant, value});
    let linearRegression: number;
    if (this.instantValues.length >= this.numberOfPeriods) {
      linearRegression = this.linearRegression();
      this.instantValues.shift();
    } else {
      linearRegression = null;
    }
    return linearRegression;
  }

  private linearRegression(): number {
    let onlineLinearRegression: OnlineLinearRegression = new OnlineLinearRegression();
    let year0: number;
    this.instantValues.forEach( iv => {
      let year: number = iv.instant.valueOf() / MILLISECONDS_IN_A_YEAR;
      if (!year0) {
        year0 = year;
      }
      let x = year - year0;
      onlineLinearRegression.regression(x, iv.value);
    });
    let annualRate =  100 * (onlineLinearRegression.getA() / onlineLinearRegression.getB());
    return annualRate;
  }
}
