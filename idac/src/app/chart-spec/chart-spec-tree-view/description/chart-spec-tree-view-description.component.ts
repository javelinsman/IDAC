import { Component, OnInit, Input, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-spec-tree-view-description',
  templateUrl: './chart-spec-tree-view-description.component.html',
  styleUrls: ['./chart-spec-tree-view-description.component.scss']
})
export class ChartSpecTreeViewDescriptionComponent implements OnInit, AfterContentChecked {

  @Input() viewOnly: boolean;
  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() edit: boolean;
  @Input() _editChange: any;

  @ViewChild('description') descriptionP: ElementRef<HTMLParagraphElement>;

  hover: boolean;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    const description =
      (this.tag.describe().length
        ? this.tag.describe()
        : '(No description)'
      ).replace(/undefined/g, '<span class="undefined-variable">undefined</span>')
    d3.select(this.descriptionP.nativeElement)
      .html(description)
  }

}
