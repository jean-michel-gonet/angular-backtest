import { IndicatorConfiguration, IndicatorConfigurationError } from './configurable-source';
import { ConfigurableSourceIndicator } from './configurable-source-indicator';

export interface GapIndicatorConfiguration extends IndicatorConfiguration {
  /** Maximum number of periods considered when measuging a gap. **/
  maximumGapWidth?: number;
}

export class GapIndicatorConfigurationMaximumGapWidthError extends IndicatorConfigurationError {
  constructor(public numberOfPeriods: number, public maximumGapWidth: number) {
    super("Gap Indicator numberOfPeriods smaller than maximumGapWidth: "
      + numberOfPeriods + " < " + maximumGapWidth);
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
 * Gaps are calculated over a maximum of {#maximumGapWidth} number of periods.
 */
export class GapIndicator extends ConfigurableSourceIndicator {
  public maximumGapWidth: number;
  private positionCounter: number = 0;
  private gaps: Gap[];
  private maximumGap: Gap;

  /**
   * Class constructor.
   * @param obj The configuration.
   */
  constructor(obj = {} as GapIndicatorConfiguration) {
    super(obj);
    let {
      maximumGapWidth = this.numberOfPeriods
    } = obj;
    if (this.numberOfPeriods < maximumGapWidth) {
      throw new GapIndicatorConfigurationMaximumGapWidthError(this.numberOfPeriods, maximumGapWidth);
    } else {
      this.maximumGapWidth = maximumGapWidth;
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

    let from = Math.max(0, this.gaps.length - this.maximumGapWidth);
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
