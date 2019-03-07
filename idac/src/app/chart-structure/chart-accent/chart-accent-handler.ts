import { ChartAccent } from './chart-accent';
import { d3Selection } from 'src/app/chartutils';
import { d3AsSelectionArray, d3ImmediateChildren } from 'src/app/utils';

export class ChartAccentHandler {
  constructor(private json: ChartAccent, private svg: d3Selection<SVGSVGElement>) { }
  convertToSpec(): d3Selection<SVGSVGElement> {
    const [annotationBackground, g2, annotationForeground] = d3AsSelectionArray(d3ImmediateChildren(this.svg, 'g'));
    const [title, legend, chart] = d3AsSelectionArray(d3ImmediateChildren(g2, 'g'));
    title.classed('idac-title', true).attr('data', 'Hello' || this.json.chart.title.text);
    return this.svg;
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
    if(cs.chartType === 'bar-chart') {
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
    }
  }
}
