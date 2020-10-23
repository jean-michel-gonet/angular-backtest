import { Candlestick } from '../../core/quotes';
import { Indicator } from './indicator';
import { AverageTrueRange } from '../statistics/average-true-range';


/**
 * Implements the ATR indicator over the specified number of periods and based
 * on the specified threshold.
 * <ol>
 * <li>First calculates the ATR over the specified number of periods.</li>
 * <li>Then calculates today's L1 as today's close value minus ATR times the threshold.</li>
 * <li>If today's L1 is higher than yesterday's L1, then takes today's L1.
 * <li>If today's close is lower than yesterday's L1, then today's L1 is today's close.
 * </ol>
 * of the specified number of periods.
 * @class{AtrIndicator}
 */
export class AtrIndicator implements Indicator {
  private averageTrueRange: AverageTrueRange;
  private countDown: number;
  private l1: number;
  public atr: number;
  public upsInARow: number;
  public downsInARow: number;

  constructor(public numberOfPeriods: number, public threshold: number) {
    this.averageTrueRange = new AverageTrueRange(numberOfPeriods);
    this.countDown = numberOfPeriods;
    this.upsInARow = 0;
    this.downsInARow = 0;
  }

  calculate(instant: Date, candlestick: Candlestick): number {
    // Updates the ATR:
    let atr:number = this.averageTrueRange.atr(candlestick);

    if (atr != undefined && --this.countDown <= 0) {
      this.atr = atr;

      // Updates the L1:
      let l1: number = candlestick.close - this.threshold * atr;
      if (!this.l1) {
        this.l1 = l1;
      } else {
        // Moves up:
        if (this.l1 < l1) {
          this.l1 = l1;
          this.upsInARow += 1;
        } else {
          this.upsInARow = 0;
        }
        // Moves down:
        if (this.l1 > candlestick.close ) {
          this.l1 = candlestick.close;
          this.downsInARow += 1;
        } else {
          this.downsInARow = 0;
        }
      }
    }

    // Returns the l1:
    return this.l1;
  }

  getMovement(): number {
    return this.upsInARow - this.downsInARow;
  }
}
