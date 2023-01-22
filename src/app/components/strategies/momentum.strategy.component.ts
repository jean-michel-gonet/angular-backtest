import { Component, ContentChild, Input } from '@angular/core';
import { Period, Periodicity } from 'src/app/model/core/period';
import { MomentumQuoteAssessor } from 'src/app/model/strategies/quote-assessor.momentum';
import { TopOfUniverseQuotesAssessor } from 'src/app/model/strategies/quotes-assessor.top-of-universe';
import { RebalancingStrategy } from 'src/app/model/strategies/strategy.rebalancing';
import { StringUtils } from 'src/app/model/utils/string-utils';
import { UniverseService } from 'src/app/services/universe/universe.service';
import { MarketTimingComponent } from '../markettiming/market-timing.component';

/**
 * - Trade only on wednesdays - Strategy is a long term method to beat the
 *   index. Part of the strategy is to avoid acting too fast. If stock plunges
 *   20%, we don't do a thing unless it's wednesday.
 * - Rank all assets based on volatility adjusted momentum. This means multiply
 *   the annualized exponential regression by the coefficient of determination.
 * - Disqualify an asset if: a) trading below its 100 days moving average, b) has
 *   a recent gap of 15% or more, c) it is not in the 20% top of the ranked list.
 * - Calculate position sizes based on 10 basis points: Account value, times 0.001,
 *   divided by 20 days average true range.
 * - Check index: only open new positions if the index is over its 200 days moving average.
 * - Construct initial portfolio: Start at the top of the list, buying non disqualified
 *   assets until out of cash.
 * - Rebalance portfolio every wednesday: sell any disqualified asset. Buy new assets
 *   with the cash.
 * - Rebalance positions every second wednesday: Reconstruct the initial portfolio,
 *   compare with current, and adjust any non-minor difference.
 */
@Component({
  selector: 'momentum',
  template: ''
})
export class MomentumStrategyComponent {
  constructor(private universService: UniverseService) {
  }

  @Input()
  universeName: string;

  _momentumDistance: number;
  @Input()
  set momentumDistance(value: number) {
    if (typeof value == 'string') {
      this._momentumDistance = parseInt(value);
    } else {
      this._momentumDistance = value;
    }
  }

  _maximumAcceptableGap: number;
  @Input()
  set maximumAcceptableGap(value: number) {
    if (typeof value == 'string') {
      this._maximumAcceptableGap = parseFloat(value);
    } else {
      this._maximumAcceptableGap = value;
    }
  }

  _gapDistance: number;
  @Input()
  set gapDistance(value: number) {
    if (typeof value == 'string') {
      this._gapDistance = parseInt(value);
    } else {
      this._gapDistance = value;
    }
  }

  _averageTrueRangeDistance: number;
  @Input()
  set averageTrueRangeDistance(value: number) {
    if (typeof value == 'string') {
      this._averageTrueRangeDistance = parseInt(value);
    } else {
      this._averageTrueRangeDistance = value;
    }
  }

  _maximumAtrPerPosition: number;
  @Input()
  set maximumAtrPerPosition(value: number) {
    if (typeof value == 'string') {
      this._maximumAtrPerPosition = parseFloat(value);
    } else {
      this._maximumAtrPerPosition = value;
    }
  }

  _movingAverageDistance: number;
  @Input()
  set movingAverageDistance(value: number) {
    if (typeof value == 'string') {
      this._movingAverageDistance = parseInt(value);
    } else {
      this._movingAverageDistance = value;
    }
  }

  _topOfIndex: number;
  @Input()
  set topOfIndex(value: number) {
    if (typeof value == 'string') {
      this._topOfIndex = parseInt(value);
    } else {
      this._topOfIndex = value;
    }
  }

  _tradingDayOfTheWeek: number;
  @Input()
  set tradingDayOfTheWeek(value: number) {
    if (typeof value == 'string') {
      this._tradingDayOfTheWeek = parseInt(value);
    } else {
      this._tradingDayOfTheWeek = value;
    }
  }

  _smallestOperation: number;
  @Input()
  set smallestOperation(value: number) {
    if (typeof value == 'string') {
      this._smallestOperation = parseInt(value);
    } else {
      this._smallestOperation = value;
    }
  }

  _minimumCash: number;
  @Input()
  set minimumCash(value: number) {
    if (typeof value == 'string') {
      this._minimumCash = parseInt(value);
    } else {
      this._minimumCash = value;
    }
  }

  _startInvesting: Date;
  @Input()
  set startInvesting(value: Date) {
    if (typeof value == 'string') {
      this._startInvesting = StringUtils.convertToDate(value);
    } else {
      this._startInvesting = value;
    }
  }

  @ContentChild(MarketTimingComponent, {static: true})
  private marketTiming: MarketTimingComponent;

  public asStrategy(): RebalancingStrategy {
    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        return new MomentumQuoteAssessor({
          name: name,
          momentumDistance: this._momentumDistance,
          maximumAcceptableGap: this._maximumAcceptableGap,
          gapDistance: this._gapDistance,
          averageTrueRangeDistance: this._averageTrueRangeDistance,
          maximumAtrPerPosition: this._maximumAtrPerPosition,
          movingAverageDistance: this._movingAverageDistance
        });
      },
      topOfIndex: this._topOfIndex,
      universe: this.universService.getUniverse(this.universeName)
    });
    let positionRebalancePeriod = new Period(Periodicity.WEEKLY, this._tradingDayOfTheWeek, 2);

    let portfolioRebalancePeriod = new Period(Periodicity.WEEKLY, this._tradingDayOfTheWeek)
    let marketTiming = this.marketTiming.asMarketTiming();
    return new RebalancingStrategy({
      minimumCash: this._minimumCash,
      smallestOperation: this._smallestOperation,
      startInvesting: this._startInvesting,
      marketTiming: marketTiming,
      portfolioRebalancePeriod: portfolioRebalancePeriod,
      positionRebalancePeriod: positionRebalancePeriod,
      quotesAssessor: quotesAssessor,
    });
  }
}
