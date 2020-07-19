import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { MarketTimingPage } from './pages/market-timing/market-timing.page';
import { InvestingInBearPage } from './pages/investing-in-bear/investing-in-bear.page';
import { OptimizationEmaPage } from './pages/optimization/optimization-ema.page';
import { OptimizationSuperthonPage } from './pages/optimization/optimization-superthon.page';


const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'market-timing', component: MarketTimingPage},
  { path: 'investing-in-bear', component: InvestingInBearPage},
  { path: 'optimization-ema', component: OptimizationEmaPage},
  { path: 'optimization-superthon', component: OptimizationSuperthonPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
