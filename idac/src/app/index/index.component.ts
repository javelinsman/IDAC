import { Component, OnInit } from '@angular/core';
import { Chart } from '../chart';
import { ChartExampleService } from '../chart-example.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  charts: Chart[];
  svgRawStrings: string[];

  constructor(
    private chartExampleService: ChartExampleService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.charts = this.chartExampleService.getCharts();
  }

}
