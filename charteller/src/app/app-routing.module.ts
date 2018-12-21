import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NavigateComponent } from './navigate/navigate.component';

const routes: Routes = [
  { path: 'Charteller', component: IndexComponent },
  { path: 'Charteller/navigate/:id', component: NavigateComponent },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
