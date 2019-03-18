import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { ChartSpec } from 'src/app/chart-structure/chart-spec/chart-spec';
import { ChartSpecService } from 'src/app/chart-spec.service';

@Component({
  selector: 'app-chart-spec-tree-view-tagname',
  templateUrl: './chart-spec-tree-view-tagname.component.html',
  styleUrls: ['./chart-spec-tree-view-tagname.component.scss']
})
export class ChartSpecTreeViewTagnameComponent implements OnInit {
  currentTag: SpecTag;
  chartSpec: ChartSpec;

  @Input() tag: SpecTag;
  @Input() siblingIndex: number;
  @Input() siblingLength: number;
  @Input() warning: boolean;

  constructor(
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
  }

}
