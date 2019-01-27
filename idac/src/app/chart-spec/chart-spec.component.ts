import { Component, OnInit, Input } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';

@Component({
  selector: 'app-chart-spec',
  templateUrl: './chart-spec.component.html',
  styleUrls: ['./chart-spec.component.scss']
})
export class ChartSpecComponent implements OnInit {

  @Input() chartSpec: ChartSpec;
  renderList: any[];

  constructor() { }

  ngOnInit() {
    if (!this.chartSpec) {
      this.chartSpec = new ChartSpec();
    }
    console.log(this.chartSpec);
    const { title, y, x, legend, marks, annotations } = this.chartSpec;
    this.renderList = [
      title, y, x, legend, marks, annotations
    ];
  }

}
