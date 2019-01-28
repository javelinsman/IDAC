import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { AppRoutingModule } from './app-routing.module';
import { NavigateComponent } from './navigate/navigate.component';
import { DescriptionComponent } from './description/description.component';
import { KeyboardInputComponent } from './keyboard-input/keyboard-input.component';
import { ChartSpecComponent } from './chart-spec/chart-spec.component';
import { MakeChartComponent } from './make-chart/make-chart.component';
import { SvgContainerComponent } from './svg-container/svg-container.component';
import { DescriptionPanelComponent } from './panels/description-panel/description-panel.component';
import { EditorsNotePanelComponent } from './panels/editors-note-panel/editors-note-panel.component';
import { PropertiesPanelComponent } from './panels/properties-panel/properties-panel.component';
import { ChartSpecTreeViewComponent } from './chart-spec/chart-spec-tree-view/chart-spec-tree-view.component';
import { ChartViewComponent } from './chart-view/chart-view.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavigateComponent,
    DescriptionComponent,
    KeyboardInputComponent,
    ChartSpecComponent,
    ChartSpecTreeViewComponent,
    MakeChartComponent,
    SvgContainerComponent,
    DescriptionPanelComponent,
    EditorsNotePanelComponent,
    PropertiesPanelComponent,
    ChartViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
