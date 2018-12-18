import { Component, OnInit } from '@angular/core';
import { Chart } from '../chart';
import { ChartService } from '../chart.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  charts: Chart[];

  constructor(private chartService: ChartService) { }

  ngOnInit() {
    this.getCharts()
  }

  getCharts(): void {
    this.charts = this.chartService.getCharts();
  }

}
