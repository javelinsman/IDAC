import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChartSpec } from 'src/app/chart-structure/chart-spec/chart-spec';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  @Input() chartSpec: ChartSpec;
  @Input() currentTag: SpecTag;

  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter(null);

  annotations;

  constructor() { }

  ngOnInit() {
    this.annotations = [];
    this.chartSpec.annotations.flattenedTags().slice(1).forEach(annotation => {
      this.annotations.push(annotation);
    });
  }

}
