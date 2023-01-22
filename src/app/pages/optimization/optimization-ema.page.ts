import { Component, OnInit } from '@angular/core';
import { QuotesService } from 'src/app/services/quotes/quotes.service';
import { Simulation } from 'src/app/model/core/simulation';
import { SwissQuoteAccount } from 'src/app/model/accounts/account.swissquote';
import { BuyAndHoldStrategy } from 'src/app/model/strategies/strategy.buy-and-hold';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { Periodicity } from 'src/app/model/core/period';
import { HighlightReport } from 'src/app/model/reports/highlight/highlight-report';
import { MaxHighlight, MinHighlight, StdHighlight, AvgHighlight } from 'src/app/model/reports/highlight/highlight';
import { Reports } from 'src/app/model/reports/reports';
import { PerformancePreprocessor } from 'src/app/model/reports/preprocessors/performance-preprocessor';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';
import { HistoricalQuotes } from 'src/app/model/core/quotes';
import { SimulationStatus } from 'src/app/components/simulation/simulation.component';


class SimulationResult {
  longEma: number;
  shortEma: number;
  triggers: number;
  max3: number;
  min3: number;
  avg3: number;
  std3: number;
  max7: number;
  min7: number;
  avg7: number;
  std7: number;
  max10: number;
  min10: number;
  avg10: number;
  std10: number;
}

@Component({
  selector: 'optimization-ema-page',
  templateUrl: './optimization-ema.page.html',
  styleUrls: ['./optimization-ema.page.css']
})
export class OptimizationEmaPage implements OnInit {
  private status: SimulationStatus;
  private results: SimulationResult[] = [];
  private historicalQuotes: HistoricalQuotes;

  constructor(private quotesService:QuotesService) {}

  ngOnInit(): void {
    this.quotesService.getQuotes(["SMI"]).subscribe(historicalQuotes => {
      this.historicalQuotes = historicalQuotes;
      this.status = SimulationStatus.WAITING;
    });
  }

  displayRunButton(): boolean  {
    return this.status == SimulationStatus.WAITING;
  }

  run(): void {
    this.status = SimulationStatus.RUNNING;
    this.runAllSimulations().then(() => {
      this.status = SimulationStatus.COMPLETED
    });
  }

  async runAllSimulations(): Promise<void> {
    let longEma: number;
    let shortEma: number;

    // For all values of long and short ema:
    for(shortEma = 20; shortEma < 200; shortEma += 20) {
      for(longEma = shortEma * 2; longEma < shortEma * 8; longEma += shortEma / 4) {
        let simulationResult: SimulationResult = await this.runOneSimulation(shortEma, longEma);
        this.results.push(simulationResult);
      }
    }
  }

  async runOneSimulation(shortEma: number, longEma: number): Promise<SimulationResult> {
    // Prepare the highlights:
    let triggers:  MaxHighlight = new MaxHighlight("EMA.TRI");
    let max3:  MaxHighlight = new MaxHighlight("ACC.P03");
    let min3:  MinHighlight = new MinHighlight("ACC.P03");
    let std3:  StdHighlight = new StdHighlight("ACC.P03");
    let avg3:  AvgHighlight = new AvgHighlight("ACC.P03");
    let max7:  MaxHighlight = new MaxHighlight("ACC.P07");
    let min7:  MinHighlight = new MinHighlight("ACC.P07");
    let std7:  StdHighlight = new StdHighlight("ACC.P07");
    let avg7:  AvgHighlight = new AvgHighlight("ACC.P07");
    let max10: MaxHighlight = new MaxHighlight("ACC.P10");
    let min10: MinHighlight = new MinHighlight("ACC.P10");
    let std10: StdHighlight = new StdHighlight("ACC.P10");
    let avg10: AvgHighlight = new AvgHighlight("ACC.P10");

    // Prepare the simulation:
    let simulation: Simulation = new Simulation({
      quoteService: this.quotesService,
      accounts: [new SwissQuoteAccount({
        id: "ACC",
        cash: 100000,
        strategy: new BuyAndHoldStrategy({
          assetName: "SMI",
          marketTiming: new EMAMarketTiming({
            assetName: "SMI",
            id: "EMA",
            periodicity: Periodicity.DAILY,
            fastPeriod: shortEma,
            slowPeriod: longEma
          })
        })
      })],
      report: new Reports({
        reports: [
          new HighlightReport([
            triggers,
            max3,  min3,  avg3,  std3,
            max7,  min7,  avg7,  std7,
            max10, min10, avg10, std10])],
        preProcessors:[
          new PerformancePreprocessor({
            source: "ACC.NAV",
            over: 3,
            unitOfTime: UnitOfTime.YEAR,
            output: "ACC.P03"}),
          new PerformancePreprocessor({
            source: "ACC.NAV",
            over: 7,
            unitOfTime: UnitOfTime.YEAR,
            output: "ACC.P07"}),
          new PerformancePreprocessor({
            source: "ACC.NAV",
            over: 10,
            unitOfTime: UnitOfTime.YEAR,
            output: "ACC.P10"})]
      })
    });
    // Run the simulation:
    simulation.run(new Date(2000, 0, 1), new Date(2020, 6, 17)).subscribe(() => {

    });

    // Returns the result of the simulation:
    return {
      longEma: longEma,
      shortEma: shortEma,
      triggers: triggers.max,
      max3: max3.max, min3: min3.min, avg3: avg3.avg, std3: std3.std,
      max7: max7.max, min7: min7.min, avg7: avg7.avg, std7: std7.std,
      max10: max10.max, min10: min10.min, avg10: avg10.avg, std10: std10.std
    };
  }
}
