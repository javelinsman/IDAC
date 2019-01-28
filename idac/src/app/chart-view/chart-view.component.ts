import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import * as d3 from 'd3';
import { SvgContainerComponent } from '../svg-container/svg-container.component';
import { d3ImmediateChildren, d3AsSelectionArray } from '../utils';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  @Input() src: string;
  @Input() chartSpec: ChartSpec;
  @Input() currentTag: SpecTag;
  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter();

  @ViewChild(SvgContainerComponent) svgContainer: SvgContainerComponent;

  svg: d3.Selection<SVGGElement, any, HTMLElement, any>;

  constructor() { }

  ngOnInit() {
  }

  onSVGInit() {
    this.svg = d3.select(this.svgContainer.svgContainerDiv.nativeElement).select('svg');
    const [annotationBackground, g2, annotationForeground] = d3AsSelectionArray(d3ImmediateChildren(this.svg, 'g'));
    const [title, legend, chart] = d3AsSelectionArray(d3ImmediateChildren(g2, 'g'));
    const items = legend.selectAll('.legend');
    const [marks, x, y, yLabel, xLabel] = d3AsSelectionArray(d3ImmediateChildren(chart, 'g'));
    const serieses = d3AsSelectionArray(d3ImmediateChildren(marks, 'g'));
    const xTicks = x.selectAll('.tick');
    const yTicks = y.selectAll('.tick');
    const annotation = annotationBackground.merge(annotationForeground);

    annotationForeground.selectAll('._uniqueid_930').style('fill', 'green').selectAll('*').style('fill', 'green');
    annotationForeground.selectAll('._uniqueid_933').style('fill', 'pink').selectAll('*').style('fill', 'pink');
  }

  _currentTagChange(tag: SpecTag) {
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }

}
