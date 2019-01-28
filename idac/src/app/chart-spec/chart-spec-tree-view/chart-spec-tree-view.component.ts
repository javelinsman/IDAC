import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
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
  @Input() isCollapsed: string;
  @Input() siblingIndex: number;
  @Input() siblingLength: number;

  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter();

  edit = false;
  numAttributes: number;

  collapsable = false;
  collapseChildren = false;
  collapseIndex = 0;

  constructor() { }

  ngOnInit() {
    if (!this.indent) {
      this.indent = 0;
    }
    this.numAttributes = Object.entries(this.tag.attributes).length;
    if (this.tag.children && this.tag.children.length > 1) {
      this.collapsable = true;
    }
  }

  _currentTagChange(tag: SpecTag) {
    // console.log(`My name is ${this.tag._tagname} and I am changing currentTag into ${tag._tagname}`);
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }
}
