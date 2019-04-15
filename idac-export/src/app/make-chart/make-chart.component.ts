import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, Input, AfterContentChecked } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { ChartExampleService } from '../chart-example.service';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { StageStateService } from '../stage-state.service';
import { ChartSpecService } from '../chart-spec.service';
import { ChartAccentHandler } from '../chart-structure/chart-accent/chart-accent-handler';
import { CHARTS } from '../mock-charts';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {
  @Input() exampleId;

  specSVG;
  specJSON;

  chartSpec: ChartSpec;
  currentTag: SpecTag;

  rightPanel = 'filter';
  @ViewChild('container') containerDiv: ElementRef;
  @ViewChild('sidebar') sidebarSection: ElementRef;
  sidebarSettings: boolean;
  sidebarHelp: boolean;

  constructor(
      private chartExampleService: ChartExampleService,
      private chartSpecService: ChartSpecService,
      private http: HttpClient,
      public stageStateService: StageStateService,
    ) { }

  ngOnInit() {
    SpecTag.clear();
    this.stageStateService.toolbarSettingObservable.subscribe(settings => {
      this.sidebarSettings = settings;
    });
    this.stageStateService.toolbarHelpObservable.subscribe(help => {
      this.sidebarHelp = help;
    });
    this.chartSpecService.bindChartSpec(this);
    const json = (window as any).IDAC_JSON;
    const svgRaw = new DOMParser().parseFromString((window as any).IDAC_SVG, 'text/xml');
    const svg = d3.select(svgRaw).select('svg') as any;
    const handler = new ChartAccentHandler(json, svg);
    this.specSVG = handler.convertToSpec();
    this.specJSON = json;

    this.chartSpecService.chartSpec = new ChartSpec();
    this.chartSpecService.chartSpec.fromSpecSVG(this.specSVG);
    this.chartSpecService.chartSpec.fromChartAccent(json);

    const savedChartSpec = (window as any).IDAC_CHART_SPEC;
    this.loadChartSpec(this.chartSpecService.chartSpec, savedChartSpec);

    this.chartSpecService.currentTag = this.chartSpecService.chartSpec.findById(0);

    this.onWindowResize();
  }

  loadChartSpec(chartSpec, saved) {
    chartSpec.attributes = saved.attributes;
    chartSpec.properties = Object.entries(saved.properties)
      .reduce((accum, [key, value]) => { accum[key] = () => value; return accum; }, {});
    chartSpec.descriptionRule = saved.descriptionRule;
    chartSpec.editorsNote = saved.editorsNote;
    chartSpec.active = saved.active;
    chartSpec._children.forEach((child, i) => this.loadChartSpec(child, saved._children[i]));
  }

  onWindowResize() {
    const mainHeight = `${window.innerHeight - 20 - 50}px`;
    d3.select(this.containerDiv.nativeElement).style('height', mainHeight);
  }


  fetchExampleChart(id: number) {
    return this.chartExampleService.getCharts()[id];
  }

  fetchChart() {
    return this.chartExampleService.getCharts()[0];
  }
}
