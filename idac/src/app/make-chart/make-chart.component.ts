import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { ChartDescription } from '../chart-structure/chart-description/chart-description';
import { NavigateComponent } from '../navigate/navigate.component';
import { ActivatedRoute } from '@angular/router';
import { ChartExampleService } from '../chart-example.service';
import * as d3 from 'd3';
import { Chart } from '../chart';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {
  chart: Chart;

  constructor(
      private chartExampleService: ChartExampleService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {
    const exampleId = +this.route.snapshot.paramMap.get('exampleId');
    if (exampleId) {
      this.fetchExampleData(exampleId);
    }
  }

  fetchExampleData(id: number) {
    this.chart = this.chartExampleService.getCharts()[id];
  }

}
