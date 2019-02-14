import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, Input, AfterContentChecked } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { ActivatedRoute } from '@angular/router';
import { ChartExampleService } from '../chart-example.service';
import * as d3 from 'd3';
import { Chart } from '../chart';
import { ChartAccent } from '../chart-structure/chart-accent/chart-accent';
import { HttpClient } from '@angular/common/http';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { StageStateService } from '../stage-state.service';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {
  @Input() exampleId: number;

  chart: Chart;
  chartAccent: ChartAccent;
  chartSpec: ChartSpec;

  currentTag: SpecTag;
  rightPanel = 'filter';
  @ViewChild('container') containerDiv: ElementRef;
  @ViewChild('sidebar') sidebarSection: ElementRef;

  sidebarSettings: boolean;
  sidebarHelp: boolean;

  constructor(
      private chartExampleService: ChartExampleService,
      private route: ActivatedRoute,
      private http: HttpClient,
      public stageStateService: StageStateService
    ) { }

  ngOnInit() {
    SpecTag.clear();
    this.stageStateService.toolbarSettingObservable.subscribe(settings => {
      this.sidebarSettings = settings;
    })
    this.stageStateService.toolbarHelpObservable.subscribe(help => {
      this.sidebarHelp = help;
    })

    if (this.exampleId) {
      this.chart = this.fetchExampleChart(this.exampleId);
    } else {
      this.chart = this.fetchChart();
    }

    this.http.get<ChartAccent>(this.chart.src_json).subscribe(data => {
      this.chartAccent = data;
      this.chartSpec = new ChartSpec();
      this.chartSpec.fromChartAccent(this.chartAccent);
      this.currentTag = this.chartSpec.findById(1);
    });
    this.onWindowResize();
  }

  onWindowResize() {
    const mainHeight = `${window.innerHeight - 20 - 50}px`;
    d3.select(this.containerDiv.nativeElement).style('height', mainHeight);
    d3.select(this.sidebarSection.nativeElement).style('height', mainHeight);
  }


  fetchExampleChart(id: number) {
    return this.chartExampleService.getCharts()[id];
  }

  fetchChart() {
    return this.chartExampleService.getCharts()[0];
  }
}
