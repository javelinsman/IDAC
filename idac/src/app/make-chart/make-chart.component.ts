import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { NavigateComponent } from '../navigate/navigate.component';
import { ActivatedRoute } from '@angular/router';
import { ChartExampleService } from '../chart-example.service';
import * as d3 from 'd3';
import { Chart } from '../chart';
import { ChartAccent } from '../chart-structure/chart-accent/chart-accent';
import { HttpClient } from '@angular/common/http';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {
  chart: Chart;
  chartAccent: ChartAccent;
  chartSpec: ChartSpec;

  currentTag: SpecTag;
  @ViewChild('container') containerDiv: ElementRef;

  constructor(
      private chartExampleService: ChartExampleService,
      private route: ActivatedRoute,
      private http: HttpClient
    ) { }

  ngOnInit() {
    const exampleId = +this.route.snapshot.paramMap.get('exampleId');
    if (exampleId) {
      this.chart = this.fetchExampleChart(exampleId);
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
    d3.select(this.containerDiv.nativeElement).style('height', `${window.innerHeight - 20 - 50}px`);
  }


  fetchExampleChart(id: number) {
    return this.chartExampleService.getCharts()[id];
  }

  fetchChart() {
    return this.chartExampleService.getCharts()[0];
  }
}
