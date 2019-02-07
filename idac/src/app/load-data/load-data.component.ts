import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartExampleService } from '../chart-example.service';
import { Chart } from '../chart';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})
export class LoadDataComponent implements OnInit {

  charts: Chart[];
  svgRawStrings: string[];
  @Output() exampleIdChange: EventEmitter<number> = new EventEmitter();

  constructor(
    private chartExampleService: ChartExampleService,
  ) { }

  ngOnInit() {
    this.charts = this.chartExampleService.getCharts();
  }

  _exampleIdChange(d: number) {
    this.exampleIdChange.emit(d);
  }


}
