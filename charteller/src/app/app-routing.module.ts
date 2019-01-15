import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { MakeChartComponent } from './make-chart/make-chart.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'make-chart', component: MakeChartComponent },
  { path: 'make-chart/example/:exampleId', component: MakeChartComponent },
  // { path: 'navigate/:id', component: NavigateComponent },
  // { path: 'navigate/:id/:mode', component: NavigateComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
