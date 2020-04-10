import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { MarketTimingPage } from './pages/market-timing/market-timing.page';
import { InvestingInBearPage } from './pages/investing-in-bear/investing-in-bear.page';


const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'market-timing', component: MarketTimingPage},
  { path: 'investing-in-bear', component: InvestingInBearPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
