import { IndicatorConfiguration, IndicatorConfigurationError } from './configurable-source';
import { ConfigurableSourceIndicator } from './configurable-source-indicator';

export interface GapIndicatorConfiguration extends IndicatorConfiguration {
   /**
    * The width of the gap itself, number of periods considered when measuring a gap.
    * For example, consider the following series "10, 10, 10, 15, 20, 25, 25":
    * - If the gap width is 1, then the gap is 5, because that's the maximum variation
    *   between any two consecutive values.
    * - If the gap width is 2, then the gap is 10, because that's maximum variation
    *   between any two values that are either 1 or 2 positions apart.
    * - If the gap width is 3, then the gap is 15, because that's maximum variation
    *   between any two values that are either 1, 2 or 3 positions apart.
    **/
  numberOfPeriods: number;
  /**
   * The number of periods we're looking in the past.
   * Gaps occurring beyond this number are not considered any more.
   **/
  gapWidth?: number;
}

export class GapIndicatorConfigurationGapWidthError extends IndicatorConfigurationError {
  constructor(public numberOfPeriods: number, public gapWidth: number) {
    super("Gap Indicator numberOfPeriods smaller than gapWidth: "
      + numberOfPeriods + " < " + gapWidth);
  }
}

interface Gap {
  value: number;
  gap: number;
  instant?: Date;
  gapWith?: Gap;
}

/**
 * Looks for the maximum gap between any two values within the relevant period
 * range.
 * Gaps are calculated over a maximum of {#gapWidth} number of periods.
 */
export class GapIndicator extends ConfigurableSourceIndicator {
  public numberOfPeriods: number;
  public gapWidth: number;
  private gaps: Gap[];
  private maximumGap: Gap;

  /**
   * Class constructor.
   * @param obj The configuration.
   */
  constructor(obj = {} as GapIndicatorConfiguration) {
    super(obj);
    let {
      numberOfPeriods,
      gapWidth = numberOfPeriods
    } = obj;
    this.numberOfPeriods = numberOfPeriods;
    if (this.numberOfPeriods < gapWidth) {
      throw new GapIndicatorConfigurationgapWidthError(this.numberOfPeriods, gapWidth);
    } else {
      this.gapWidth = gapWidth;
    }
    this.gaps = [];
  }

  protected compute(instant: Date, value: number): number {
    let incomingGap = this.calculateIncomingGap(instant, value);
    this.gaps.push(incomingGap);
    if (!this.maximumGap || this.maximumGap.gap < incomingGap.gap) {
      this.maximumGap = incomingGap;
    }

    if (this.gaps.length > this.numberOfPeriods) {
      let outgoingGap = this.gaps.shift();
      outgoingGap.gapWith = null;
      if (outgoingGap == this.maximumGap) {
        this.maximumGap == null;
        this.gaps.forEach(gap => {
          if (!this.maximumGap || this.maximumGap.gap < gap.gap) {
            this.maximumGap = gap;
          }
        });
      }
    }

    return this.maximumGap.gap;
  }

  private calculateIncomingGap(instant: Date, value: number): Gap {
    let incomingGap: Gap = {
      instant: instant,
      value: value,
      gap: 0
    };

    let from = Math.max(0, this.gaps.length - this.gapWidth);
    let to = this.gaps.length - 1;
    for(var i = from; i <= to; i++) {
      let previousValue:number = this.gaps[i].value;
      let gap = Math.abs(value - previousValue) / previousValue;
      if (gap > incomingGap.gap) {
        incomingGap.gap = gap;
        incomingGap.gapWith = this.gaps[i];
      }
    }

    return incomingGap;
  }
}
