import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec-tree-view-bar-utils',
  templateUrl: './chart-spec-tree-view-bar-utils.component.html',
  styleUrls: ['./chart-spec-tree-view-bar-utils.component.scss']
})
export class ChartSpecTreeViewBarUtilsComponent implements OnInit {
  @Input() tag: SpecTag;
  @Input() siblingLength: number;
  @Input() isCollapsed: boolean;
  @Input() _collapseToggle: any;
  @Input() edit: boolean;

  constructor() { }

  ngOnInit() {
  }

}
