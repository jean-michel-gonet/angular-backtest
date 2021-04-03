import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HighchartsReportComponent } from './components/reports/chart-report/highcharts-report.component';
import { ChartReportConfigurationComponent } from './components/reports/chart-report/chart-report-configuration.component';
import { ChartReportAnnotationComponent } from './components/reports/chart-report/chart-report-annotation.component';
import { HighlightReportComponent } from './components/reports/highlight-report/highlight-report.component';
import { PerformancePreprocessorComponent} from './components/reports/preprocessors/performance-preprocessor.component';
import { RegressionPreprocessorComponent} from './components/reports/preprocessors/regression-preprocessor.component';
import { LowessPreprocessorComponent} from './components/reports/preprocessors/lowess-preprocessor.component';
import { PreprocessorsComponent } from './components/reports/preprocessors/preprocessors.component';
import { ReportsComponent } from './components/reports/reports.component';

import { AccountComponent, AccountsComponent } from './components/accounts/accounts.component';
import { TransferToComponent } from './components/accounts/transfer-to.component';
import { SwissQuoteAccountComponent } from './components/accounts/swiss-quote-account.component';

import { RegularTransferComponent } from './components/transfer/regular-transfer.component';

import { StrategyComponent } from './components/strategies/strategy.component';
import { BuyAndHoldStrategyComponent } from './components/strategies/b-a-h.strategy.component';
import { EMAMarketTimingComponent } from './components/markettiming/market-timing.ema.component';
import { SuperthonMarketTimingComponent } from './components/markettiming/market-timing.superthon.component';
import { MACDMarketTimingComponent } from './components/markettiming/market-timing.macd.component';
import { StopLossMarketTimingComponent } from './components/markettiming/market-timing.stop-loss.component';
import { RsiMarketTimingComponent } from './components/markettiming/market-timing.rsi.component';
import { MomentumMarketTimingComponent } from './components/markettiming/market-timing.momentum.component';
import { MarketTimingComponent } from './components/markettiming/market-timing.component';

import { SimulationComponent } from './components/simulation/simulation.component';

import { HighlightMaxComponent,
         HighlightDateMaxComponent,
         HighlightMinComponent,
         HighlightDateMinComponent,
         HighlightAvgComponent,
         HighlightStdComponent } from './components/reports/highlight-report/highlight.component';

import { HomePage } from './pages/home/home.page';
import { HighchartsPage } from './pages/highcharts/highcharts.page';
import { MarketTimingPage } from './pages/market-timing/market-timing.page';
import { SuperthonPage } from './pages/market-timing/superthon.page';
import { InvestingInBearPage } from './pages/investing-in-bear/investing-in-bear.page';
import { OptimizationEmaPage } from './pages/optimization/optimization-ema.page';
import { OptimizationSuperthonPage } from './pages/optimization/optimization-superthon.page';
import { AllocationsAllWeatherPage } from './pages/allocations/all-weather.page';
import { AllocationComponent, FixedAllocationsStrategyComponent } from './components/strategies/fixed-allocation.strategy.component';

@NgModule({
  declarations: [
    AppComponent,

    ChartReportConfigurationComponent,
    ChartReportAnnotationComponent,
    PreprocessorsComponent,
    HighlightReportComponent,
    HighlightMaxComponent,
    HighlightDateMaxComponent,
    HighlightMinComponent,
    HighlightDateMinComponent,
    HighlightAvgComponent,
    HighlightStdComponent,
    PerformancePreprocessorComponent,
    RegressionPreprocessorComponent,
    LowessPreprocessorComponent,
    HighchartsReportComponent,
    ReportsComponent,

    EMAMarketTimingComponent,
    SuperthonMarketTimingComponent,
    MACDMarketTimingComponent,
    StopLossMarketTimingComponent,
    RsiMarketTimingComponent,
    MomentumMarketTimingComponent,
    MarketTimingComponent,

    SwissQuoteAccountComponent,
    TransferToComponent,
    AccountComponent,
    AccountsComponent,

    RegularTransferComponent,

    BuyAndHoldStrategyComponent,
    FixedAllocationsStrategyComponent,
    AllocationComponent,
    StrategyComponent,

    SimulationComponent,

    HomePage,
    HighchartsPage,
    MarketTimingPage,
    SuperthonPage,
    InvestingInBearPage,
    OptimizationEmaPage,
    OptimizationSuperthonPage,
    AllocationsAllWeatherPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
