import { Component, OnInit } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';

@Component({
  selector: 'app-chart-spec',
  templateUrl: './chart-spec.component.html',
  styleUrls: ['./chart-spec.component.scss']
})
export class ChartSpecComponent implements OnInit {

  chartSpec: ChartSpec;
  renderList: any[];

  constructor() { }

  ngOnInit() {
    this.chartSpec = new ChartSpec();
    console.log(this.chartSpec);
    this.renderList = [
      this.chartSpec.title,
      this.chartSpec.y,
      this.chartSpec.x,
      this.chartSpec.legend,
      this.chartSpec.marks,
      this.chartSpec.annotations,
    ];
  }

}
