import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartSpecExampleService } from '../chart-spec-example.service';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit {

  charts: Chart[];
  svgRawStrings: string[];

  constructor(
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.charts = this.chartService.getCharts();
  }

  ngAfterViewInit() {
    /*
    this.charts.forEach((chart, i) => {
      this.http.get(chart.src_svg).subscribe(() => {}, error => {
        document.getElementById(`svg-area-${i}`).innerHTML = error.error.text;
      });
    });
    */
  }

}
