import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import * as d3 from 'd3';
import { SvgContainerComponent } from '../svg-container/svg-container.component';
import { d3ImmediateChildren, d3AsSelectionArray, makeAbsoluteContext, mergeBoundingBoxes, zip } from '../utils';
import { translate } from '../chartutils';
import { HighlightShape } from './highlight-shape/highlight-shape';
import { MessageService } from '../message.service';
import { ChartSpecService } from '../chart-spec.service';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit, AfterViewChecked {

  preview = false;

  @Input() src: string;
  chartSpec: ChartSpec;
  currentTag: SpecTag;

  @ViewChild(SvgContainerComponent) svgContainer: SvgContainerComponent;

  svg: d3.Selection<SVGSVGElement, any, HTMLElement, any>;
  gElemMarks: d3.Selection<any, any, any, any>;
  gEditorsNotes: d3.Selection<any, any, any, any>;
  elementLink: {
    [key: number]: {
      tag: SpecTag, associatedElements: d3.Selection<any, any, any, any>,
      highlightShape: HighlightShape
    }
  };
  attributeLink: {
    title;
    legend;
    chart;
    items;
    marks;
    x;
    y;
    yLabel;
    xLabel;
    serieses;
    rects;
    bargroups;
    xTicks;
    yTicks;
  };


  ready = false;

  originalSVGSize = {
    width: 0,
    height: 0
  };

  allSVGElementsAreDrawn = false;

  showEditorsNote = true;

  constructor(
    private messageService: MessageService,
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
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
    let rects, bargroups, circles, pointGroups;
    if (this.currentTag._root.chartType === 'bar-chart') {
      rects = zip(serieses.map(d => d3AsSelectionArray(d3ImmediateChildren(d, 'rect'))));
      rects.forEach((elem: d3.Selection<any, any, any, any>[], i) => {
        elem.forEach(d => d.classed(`idac-bargroup-${i}`, true));
      });
      bargroups = rects.map((_, i) => this.svg.selectAll(`.idac-bargroup-${i}`));
    } else {
      circles = zip(serieses.map(d => d3AsSelectionArray(d3ImmediateChildren(d, 'circle'))));
      circles.forEach((elem: d3.Selection<any, any, any, any>[], i) => {
        elem.forEach(d => d.classed(`idac-point-group-${i}`, true));
      });
      pointGroups = circles.map((_, i) => this.svg.selectAll(`.idac-point-group-${i}`));
    }
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
    if (cs.chartType === 'bar-chart') {
      cs.marks.children.forEach((bargroup, i) => {
        pairs.push([bargroup, (bargroups as any)[i]]);
        bargroup.children.forEach((bar, j) => {
          pairs.push([bar, d3AsSelectionArray(bargroups[i])[j]]);
        });
      });
    } else {
      cs.marks.children.forEach((series, i) => {
        pairs.push([series, (serieses as any)[i]]);
        series.children.forEach((point, j) => {
          pairs.push([point, d3AsSelectionArray(pointGroups[j])[i]]);
        });
      });
    }
    /*
    annotations.forEach((annotation, i) => {
      const tag = cs.annotations.findByAnnotation(cs.annotations.annotationInChartAccent(i));
      pairs.push([tag, annotation as any]);
    });
    */
    this.elementLink = {};
    pairs.forEach(([tag, associatedElements]: [SpecTag, any]) => {
      console.log(tag, associatedElements);
      this.elementLink[tag._id] = {
        tag, associatedElements,
        highlightShape: HighlightShape.getShape(tag, associatedElements, this.svg, this.elementLink)
      };
    });
    Object.values(this.elementLink).forEach(val => val.highlightShape.afterAllRendered());

    this.attributeLink = {
      title,
      legend,
      chart,
      items,
      marks,
      x,
      y,
      yLabel,
      xLabel,
      serieses,
      rects,
      bargroups,
      xTicks,
      yTicks,
    };
  }

  onSVGInit() {
    this.ready = true;
    this.svg = d3.select(this.svgContainer.svgContainerDiv.nativeElement).select('svg');

    this.associateElements();

    this.gElemMarks = this.svg.append('g').classed('idac-elem-marks', true);
    this.gEditorsNotes = this.svg.append('g').classed('idac-editors-notes', true);

    Object.values(this.elementLink).forEach(({ tag, highlightShape }) => {
      const elemMarks = d3.selectAll(
        highlightShape.elemMarks().map(elemMark => this.gElemMarks.node().appendChild(elemMark))
      );
      elemMarks.classed('idac-elem-mark', true).data(Array.from(Array(elemMarks.size())).map(_ => tag));

      elemMarks.on('mouseover', function() { elemMarks.classed('hover', true); });
      elemMarks.on('mouseout', function() { elemMarks.classed('hover', false); });
      elemMarks.on('click', () => this._currentTagChange(tag));

      const bookmarks = d3.selectAll(
        highlightShape.bookmarks().map(bookmark => this.gElemMarks.node().appendChild(bookmark))
      );
      bookmarks.classed('idac-bookmark', true).data(Array.from(Array(bookmarks.size())).map(_ => tag));

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

      // this.updateAttribute();

    }
  }

  onWindowResize() {
    if (this.allSVGElementsAreDrawn) {
      this.resizeSVG();
    }
  }

  _currentTagChange(tag: SpecTag) {
    this.chartSpecService.currentTag = tag;
    this.messageService.shouldScroll = true;
    this.messageService.shouldCollapse = true;
  }

  updateAttribute() {
    const root = this.currentTag._root;
    const xProp = root.x.properties;
    const yProp = root.y.properties;

    const labelUnit = (label, unit) => {
      if (unit.length) {
        return `${label} (unit: ${unit})`;
      } else {
        return label;
      }

    };

    this.attributeLink.title.select('text').text(root.title.properties.title());

    if (this.attributeLink.xLabel) {
      this.attributeLink.xLabel.select('text').text(
        labelUnit(xProp.label(), xProp.unit())
      );
    }
    if (this.attributeLink.yLabel) {
      this.attributeLink.yLabel.select('text').text(
        labelUnit(yProp.label(), yProp.unit())
      );
    }
    /*
    this.attributeLink.xTicks.forEach((xTick, i) => {
      xTick.select('text').text(root.x.children[i].properties.text());
    });
    this.attributeLink.items.forEach((item, i) => {
      item.select('text').text(root.legend.children[i].properties.text());
    });
    */

  }

}
