import { Component, OnInit, Input, AfterContentChecked, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as d3 from 'd3';
import { ChartSpec } from 'src/app/chart-structure/chart-spec/chart-spec';
import { ChartSpecService } from 'src/app/chart-spec.service';

@Component({
  selector: 'app-chart-spec-tree-view-description',
  templateUrl: './chart-spec-tree-view-description.component.html',
  styleUrls: ['./chart-spec-tree-view-description.component.scss']
})
export class ChartSpecTreeViewDescriptionComponent implements OnInit, AfterViewInit {
  currentTag: SpecTag;
  chartSpec: ChartSpec;

  @Input() viewOnly: boolean;
  @Input() tag: SpecTag;
  @Input() edit: boolean;
  @Input() _editChange: any;

  @ViewChild('description') descriptionP: ElementRef<HTMLParagraphElement>;

  hover: boolean;

  prevDescription: string = null;

  constructor(
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
  }

  ngAfterViewInit() {
    const currentDescription = this.tag.describe();
    const description = (currentDescription.length ? currentDescription : '(No description)');
    d3.select(this.descriptionP.nativeElement)
      .html(description);
  }

}
