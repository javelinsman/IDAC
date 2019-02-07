import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import * as d3 from 'd3';
import { SvgContainerComponent } from '../svg-container/svg-container.component';
import { d3ImmediateChildren, d3AsSelectionArray, makeAbsoluteContext, mergeBoundingBoxes, zip } from '../utils';
import { translate } from '../chartutils';
import { HighlightShape } from './highlight-shape/highlight-shape';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit, AfterViewChecked {

  @Input() src: string;
  @Input() chartSpec: ChartSpec;
  @Input() currentTag: SpecTag;
  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter();

  @ViewChild(SvgContainerComponent) svgContainer: SvgContainerComponent;

  svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>;
  gElemMarks: d3.Selection<any, any, any, any>;
  gEditorsNotes: d3.Selection<any, any, any, any>;
  elementLink = {};
  ready = false;

  originalSVGSize = {
    width: 0,
    height: 0
  };

  allSVGElementsAreDrawn = false;

  showEditorsNote = true;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  resizeSVG() {
    const container = this.svgContainer.svgContainerDiv.nativeElement as HTMLElement;
    this.svg.attr('viewBox', `0 0 ${this.originalSVGSize.width} ${this.originalSVGSize.height + 20}`);
    this.svg.attr('width', '100%');
  }

  associateElements() {
    const [annotationBackground, g2, annotationForeground] = d3AsSelectionArray(d3ImmediateChildren(this.svg, 'g'));
    const [title, legend, chart] = d3AsSelectionArray(d3ImmediateChildren(g2, 'g'));
    const items = d3AsSelectionArray(legend.selectAll('.legend'));
    const [marks, x, y, yLabel, xLabel] = d3AsSelectionArray(d3ImmediateChildren(chart, 'g'));
    y.classed('idac-y-axis', true);
    if (yLabel) {
      yLabel.classed('idac-y-axis', true);
    }
    x.classed('idac-x-axis', true);
    if (xLabel) {
      xLabel.classed('idac-x-axis', true);
    }
    const serieses = d3AsSelectionArray(d3ImmediateChildren(marks, 'g'));
    const rects = zip(serieses.map(d => d3AsSelectionArray(d3ImmediateChildren(d, 'rect'))));
    rects.forEach((elem: d3.Selection<any, any, any, any>[], i) => {
      elem.forEach(d => d.classed(`idac-bargroup-${i}`, true));
    });
    const bargroups = rects.map((_, i) => this.svg.selectAll(`.idac-bargroup-${i}`));
    const xTicks = d3AsSelectionArray(x.selectAll('.tick'));
    const yTicks = d3AsSelectionArray(y.selectAll('.tick'));
    const annotationRenderingArea = d3AsSelectionArray(
      d3ImmediateChildren(
        d3ImmediateChildren(annotationForeground, 'g'),
        'g')
      )[0];
    const renderedAnnotations = d3AsSelectionArray(d3ImmediateChildren(annotationRenderingArea, '*'));
    const annotationIds = renderedAnnotations.map(d => d.attr('class').split(' ')[0]);
    const uniqueAnnotationIds: string[] = annotationIds.reduce((accum, id) => {
      if (!accum.includes(id)) {
        accum.push(id);
      }
      return accum;
    }, []);
    const annotations = uniqueAnnotationIds.map(id => annotationForeground.selectAll(`.${id}`));
    const cs = this.chartSpec;
    const pairs = [
      [cs.title, title],
      [cs.y, d3.selectAll('.idac-y-axis')],
      [cs.x, d3.selectAll('.idac-x-axis')],
      [cs.legend, legend],
      [cs.marks, marks],
    ];
    cs.x.children.forEach((tick, i) => {
      pairs.push([tick, xTicks[i]]);
    });
    cs.legend.children.forEach((item, i) => {
      pairs.push([item, items[i]]);
    });
    cs.marks.children.forEach((bargroup, i) => {
      pairs.push([bargroup, (bargroups as any)[i]]);
      bargroup.children.forEach((bar, j) => {
        pairs.push([bar, d3AsSelectionArray(bargroups[i])[j]]);
      });
    });
    annotations.forEach((annotation, i) => {
      const tag = cs.annotations.findByAnnotation(cs.annotations.annotationInChartAccent(i));
      pairs.push([tag, annotation as any]);
    });
    this.elementLink = {};
    pairs.forEach(([tag, associatedElements]: [SpecTag, any]) => {
      this.elementLink[tag._id] = {
        tag, associatedElements,
        highlightShape: HighlightShape.getShape(tag, associatedElements, this.svg, this.elementLink)
      };
    });
  }

  onSVGInit() {
    this.ready = true;
    this.svg = d3.select(this.svgContainer.svgContainerDiv.nativeElement).select('svg');

    this.associateElements();

    this.gElemMarks = this.svg.append('g').classed('idac-elem-marks', true);
    this.gEditorsNotes = this.svg.append('g').classed('idac-editors-notes', true);

    Object.values(this.elementLink).forEach(({ tag, associatedElement, highlightShape }) => {
      const elemMarks = d3.selectAll(
        highlightShape.elemMarks().map(elemMark => this.gElemMarks.node().appendChild(elemMark))
      ).classed('idac-elem-mark', true).data([tag]);

      elemMarks.on('mouseover', function() { d3.select(this).classed('hover', true); });
      elemMarks.on('mouseout', function() { d3.select(this).classed('hover', false); });
      elemMarks.on('click', () => this._currentTagChange(tag));

      const bookmarks = d3.selectAll(
        highlightShape.bookmarks().map(bookmark => this.gElemMarks.node().appendChild(bookmark))
      ).classed('idac-bookmark', true).data([tag]);
      // bookmarks.on('mouseover', function() { d3.select(this).classed('hover', true); });
      // bookmarks.on('mouseout', function() { d3.select(this).classed('hover', false); });
      // bookmarks.on('click', () => this._currentTagChange(tag));

    });

    this.allSVGElementsAreDrawn = true;
    this.originalSVGSize.width = +this.svg.attr('width');
    this.originalSVGSize.height = +this.svg.attr('height');
    this.resizeSVG();
  }

  getMergedBoundingBox(selection: d3.Selection<any, any, any, any>) {
    const boundingBoxes = [
      ...selection.nodes().map(d => d3.select(d)),
      ...d3AsSelectionArray(selection.selectAll('*'))
    ].map(d => {
      const elem = d.node();
      const bbox = elem.getBBox();
      const convert = makeAbsoluteContext(elem, this.svg.node());
      return {
        ...convert(bbox.x, bbox.y),
        width: bbox.width,
        height: bbox.height
      };
    });
    const mergedBox = mergeBoundingBoxes(boundingBoxes);
    mergedBox.width = Math.max(mergedBox.width, 5);
    mergedBox.height = Math.max(mergedBox.height, 5);
    return mergedBox;
  }

  makeRectFromBoundingBox(box: any, location = null) {
    if (!location) {
      location = this.svg;
    }
    return location.append('rect').attr('transform', translate(box.x, box.y))
      .attr('width', box.width).attr('height', box.height);
  }

  ngAfterViewChecked() {
    if (this.ready) {
      d3.selectAll('.idac-elem-mark')
        .classed('highlighted', (tag: SpecTag) => tag === this.currentTag);

      d3.selectAll('.idac-bookmark')
        // .classed('active', (tag: SpecTag) => tag.editorsNote.active);
        .classed('highlighted', (tag: SpecTag) => tag.editorsNote.showInGraphView && tag.editorsNote.active);

      /*
      // scroll horizontally
      const prevY = window.scrollY;
      highlightRect.node().scrollIntoView({inline: 'center'});
      window.scroll(window.scrollX, prevY);
      */

    }
  }

  onWindowResize() {
    if (this.allSVGElementsAreDrawn) {
      this.resizeSVG();
    }
  }

  _currentTagChange(tag: SpecTag) {
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
    this.messageService.shouldScroll = true;
  }

}
