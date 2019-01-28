import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec-tree-view',
  templateUrl: './chart-spec-tree-view.component.html',
  styleUrls: ['./chart-spec-tree-view.component.scss']
})
export class ChartSpecTreeViewComponent implements OnInit {

  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() indent: number;

  edit = false;
  numAttributes: number;

  constructor() { }

  ngOnInit() {
    if (!this.indent) {
      this.indent = 0;
    }
    this.numAttributes = Object.entries(this.tag.attributes).length;
  }
}
