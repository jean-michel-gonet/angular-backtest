import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ChartReportComponent } from './components/reports/chart-report/chart-report.component';
import { ChartReportConfigurationComponent } from './components/reports/chart-report/chart-report-configuration.component';
import { HighlightReportComponent } from './components/reports/highlight-report/highlight-report.component';
import { PerformancePreprocessorComponent} from './components/reports/preprocessors/performance-preprocessor.component';
import { RegressionPreprocessorComponent} from './components/reports/preprocessors/regression-preprocessor.component';
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
import { MarketTimingComponent } from './components/markettiming/market-timing.component';

import { SimulationComponent } from './components/simulation/simulation.component';

import { HomePage } from './pages/home/home.page';
import { MarketTimingPage } from './pages/market-timing/market-timing.page';
import { InvestingInBearPage } from './pages/investing-in-bear/investing-in-bear.page';

import 'hammerjs';
import 'chartjs-plugin-zoom';
import { HighlightMaxComponent,
         HighlightDateMaxComponent,
         HighlightMinComponent,
         HighlightDateMinComponent,
         HighlightAvgComponent,
         HighlightStdComponent } from './components/reports/highlight-report/highlight.component';

@NgModule({
  declarations: [
    AppComponent,

    ChartReportConfigurationComponent,
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
    ChartReportComponent,
    ReportsComponent,

    EMAMarketTimingComponent,
    SuperthonMarketTimingComponent,
    MACDMarketTimingComponent,
    MarketTimingComponent,

    SwissQuoteAccountComponent,
    TransferToComponent,
    AccountComponent,
    AccountsComponent,

    RegularTransferComponent,

    BuyAndHoldStrategyComponent,
    StrategyComponent,

    SimulationComponent,

    HomePage,
    MarketTimingPage,
    InvestingInBearPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
