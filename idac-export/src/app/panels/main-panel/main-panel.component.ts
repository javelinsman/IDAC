import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChartSpec } from 'src/app/chart-structure/chart-spec/chart-spec';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { ChartSpecService } from 'src/app/chart-spec.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  chartSpec: ChartSpec;
  currentTag: SpecTag;

  annotations;

  constructor(
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
    this.annotations = [];
    this.chartSpec.annotations.flattenedTags().slice(1).forEach(annotation => {
      this.annotations.push(annotation);
    });
  }

}
