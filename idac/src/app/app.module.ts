import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { AppRoutingModule } from './app-routing.module';
import { NavigateComponent } from './navigate/navigate.component';
import { DescriptionComponent } from './description/description.component';
import { KeyboardInputComponent } from './keyboard-input/keyboard-input.component';
import { ChartSpecComponent } from './chart-spec/chart-spec.component';
import { MakeChartComponent } from './make-chart/make-chart.component';
import { SvgContainerComponent } from './svg-container/svg-container.component';
import { EditDescriptionPanelComponent } from './panels/edit-panel/edit-description-panel/edit-description-panel.component';
import { EditPropertiesPanelComponent } from './panels/edit-panel/edit-properties-panel/edit-properties-panel.component';
import { ChartSpecTreeViewComponent } from './chart-spec/chart-spec-tree-view/chart-spec-tree-view.component';
import { ChartViewComponent } from './chart-view/chart-view.component';
import { FilterViewComponent } from './filter-view/filter-view.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PropertiesPanelPopupComponent } from './panels/edit-panel/edit-properties-panel/properties-panel-popup/properties-panel-popup.component';
import { EditPanelComponent } from './panels/edit-panel/edit-panel.component';
import { KeyboardPanelComponent } from './keyboard-input/keyboard-panel/keyboard-panel.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { ChartSpecTreeViewTagnameComponent } from './chart-spec/chart-spec-tree-view/tagname/chart-spec-tree-view-tagname.component';
import { ChartSpecTreeViewKeyHintComponent } from './chart-spec/chart-spec-tree-view/key-hint/chart-spec-tree-view-key-hint.component';
import { ChartSpecTreeViewDescriptionComponent } from './chart-spec/chart-spec-tree-view/description/chart-spec-tree-view-description.component';
import { ChartSpecTreeViewBarUtilsComponent } from './chart-spec/chart-spec-tree-view/bar-utils/chart-spec-tree-view-bar-utils.component';
import { SettingsPanelComponent } from './panels/settings-panel/settings-panel.component';
import { HelpPanelComponent } from './panels/help-panel/help-panel.component';

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
    EditDescriptionPanelComponent,
    EditPropertiesPanelComponent,
    ChartViewComponent,
    FilterViewComponent,
    NavBarComponent,
    PropertiesPanelPopupComponent,
    EditPanelComponent,
    KeyboardPanelComponent,
    LoadDataComponent,
    ChartSpecTreeViewTagnameComponent,
    ChartSpecTreeViewKeyHintComponent,
    ChartSpecTreeViewDescriptionComponent,
    ChartSpecTreeViewBarUtilsComponent,
    SettingsPanelComponent,
    HelpPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
