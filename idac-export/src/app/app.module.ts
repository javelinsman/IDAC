import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgDragDropModule } from 'ng-drag-drop';

import { AppComponent } from './app.component';
import { NavigateComponent } from './navigate/navigate.component';
import { DescriptionComponent } from './description/description.component';
import { KeyboardInputComponent } from './keyboard-input/keyboard-input.component';
import { ChartSpecComponent } from './chart-spec/chart-spec.component';
import { MakeChartComponent } from './make-chart/make-chart.component';
import { SvgContainerComponent } from './svg-container/svg-container.component';
import { ChartSpecTreeViewComponent } from './chart-spec/chart-spec-tree-view/chart-spec-tree-view.component';
import { ChartViewComponent } from './chart-view/chart-view.component';
import { KeyboardPanelComponent } from './keyboard-input/keyboard-panel/keyboard-panel.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { ChartSpecTreeViewTagnameComponent } from './chart-spec/chart-spec-tree-view/tagname/chart-spec-tree-view-tagname.component';
import { ChartSpecTreeViewKeyHintComponent } from './chart-spec/chart-spec-tree-view/key-hint/chart-spec-tree-view-key-hint.component';
import { ChartSpecTreeViewDescriptionComponent } from './chart-spec/chart-spec-tree-view/description/chart-spec-tree-view-description.component';
import { ChartSpecTreeViewBarUtilsComponent } from './chart-spec/chart-spec-tree-view/bar-utils/chart-spec-tree-view-bar-utils.component';
import { ChartSpecTreeViewAddAnnotationComponent } from './chart-spec/chart-spec-tree-view/add-annotation/chart-spec-tree-view-add-annotation.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigateComponent,
    DescriptionComponent,
    KeyboardInputComponent,
    ChartSpecComponent,
    ChartSpecTreeViewComponent,
    MakeChartComponent,
    SvgContainerComponent,
    ChartViewComponent,
    KeyboardPanelComponent,
    LoadDataComponent,
    ChartSpecTreeViewTagnameComponent,
    ChartSpecTreeViewKeyHintComponent,
    ChartSpecTreeViewDescriptionComponent,
    ChartSpecTreeViewBarUtilsComponent,
    ChartSpecTreeViewAddAnnotationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgDragDropModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
