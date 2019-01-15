import { Component, OnInit } from '@angular/core';
import { ChartSpecExampleService } from '../chart-spec-example.service';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  examples: ChartSpec[];

  constructor(private chartSpecExampleService: ChartSpecExampleService) {}

  ngOnInit() {
    this.getCharts();
  }

  getCharts(): void {
    this.chartSpecExampleService.getExamples()
      .subscribe(data => {
        this.examples = data;
      });
  }

}
