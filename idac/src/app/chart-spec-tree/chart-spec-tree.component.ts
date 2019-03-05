import { Component, OnInit } from '@angular/core';
import { ChartSpecService } from '../chart-spec.service';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec-tree',
  templateUrl: './chart-spec-tree.component.html',
  styleUrls: ['./chart-spec-tree.component.scss']
})
export class ChartSpecTreeComponent implements OnInit {

  chartSpec: ChartSpec;
  currentTag: SpecTag;

  constructor(
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    this.chartSpecService.currentTagObservable.subscribe(currentTag => {
      this.currentTag = currentTag;
    });
    this.chartSpecService.chartSpecObservable.subscribe(chartSpec => {
      this.chartSpec = chartSpec;
    });
  }

}
