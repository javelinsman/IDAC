import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec-tree-view-tagname',
  templateUrl: './chart-spec-tree-view-tagname.component.html',
  styleUrls: ['./chart-spec-tree-view-tagname.component.scss']
})
export class ChartSpecTreeViewTagnameComponent implements OnInit {
  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() siblingIndex: number;
  @Input() siblingLength: number;

  constructor() { }

  ngOnInit() {
  }

}
