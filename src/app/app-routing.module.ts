import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { MarketTimingPage } from './pages/market-timing/market-timing.page';
import { InvestingInBearPage } from './pages/investing-in-bear/investing-in-bear.page';
import { OptimizationEmaPage } from './pages/optimization/optimization-ema.page';
import { OptimizationSuperthonPage } from './pages/optimization/optimization-superthon.page';
import { HighchartsPage } from './pages/highcharts/highcharts.page';
import { AllocationsAllWeatherPage } from './pages/allocations/all-weather.page';
import { SuperthonPage } from './pages/market-timing/superthon.page';
import { MomentumPage } from './pages/momentum/momentum.page';


const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'momentum', component: MomentumPage },
  { path: 'superthon', component: SuperthonPage},
  { path: 'highcharts', component: HighchartsPage },
  { path: 'market-timing', component: MarketTimingPage},
  { path: 'optimization-ema', component: OptimizationEmaPage},
  { path: 'investing-in-bear', component: InvestingInBearPage},
  { path: 'optimization-superthon', component: OptimizationSuperthonPage},
  { path: 'allocations-all-weather', component: AllocationsAllWeatherPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
