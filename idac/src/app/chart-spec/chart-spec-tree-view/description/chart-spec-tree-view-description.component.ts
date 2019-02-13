import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec-tree-view-description',
  templateUrl: './chart-spec-tree-view-description.component.html',
  styleUrls: ['./chart-spec-tree-view-description.component.scss']
})
export class ChartSpecTreeViewDescriptionComponent implements OnInit {

  @Input() viewOnly: boolean;
  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() edit: boolean;
  @Input() _editChange: any;

  constructor() { }

  ngOnInit() {
  }

}
