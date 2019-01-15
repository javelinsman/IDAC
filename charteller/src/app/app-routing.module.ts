import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NavigateComponent } from './navigate/navigate.component';
import { ChartSpecComponent } from './chart-spec/chart-spec.component';
import { MakeChartComponent } from './make-chart/make-chart.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'chartspec', component: ChartSpecComponent },
  { path: 'make-chart', component: MakeChartComponent },
  { path: 'navigate/:id', component: NavigateComponent },
  { path: 'navigate/:id/:mode', component: NavigateComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
