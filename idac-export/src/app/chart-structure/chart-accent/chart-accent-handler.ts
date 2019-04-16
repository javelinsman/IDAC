import { ChartAccent } from './chart-accent';
import { d3Selection } from 'src/app/chartutils';
import { d3AsSelectionArray, d3ImmediateChildren, zip, Counter } from 'src/app/utils';
import { Annotations } from '../chart-spec/annotations';

export class ChartAccentHandler {
  constructor(private json: ChartAccent, private svg: d3Selection<SVGSVGElement>) { }
  convertToSpec(): d3Selection<SVGSVGElement> {
    this.svg.attr('ca-chart-type', this.json.chart.type);

    const [annotationBackground, g2, annotationForeground] = d3AsSelectionArray(d3ImmediateChildren(this.svg, 'g'));
    const [title, legend, chart] = d3AsSelectionArray(d3ImmediateChildren(g2, 'g'));
    const [marks, x, y, yLabel, xLabel] = d3AsSelectionArray(d3ImmediateChildren(chart, 'g'));

    const xTicks = d3AsSelectionArray(x.selectAll('.tick'));
    const yTicks = d3AsSelectionArray(y.selectAll('.tick'));
    const items = d3AsSelectionArray(legend.selectAll('.legend'));

    title.classed('ca-title', true);

    y.classed('ca-y-axis', true)
    yTicks.forEach((yTick, i) => yTick.classed(`ca-item ca-item-${i}`, true));

    if (yLabel) {
      yLabel.classed('ca-y-label', true);
    }

    x.classed('ca-x-axis', true)
    xTicks.forEach((xTick, i) => xTick.classed(`ca-item ca-item-${i}`, true));

    if (xLabel) {
      xLabel.classed('ca-x-label', true);
    }

    legend.classed('ca-legend', true);
    items.forEach((item, i) => {
      item.classed(`ca-item ca-item-${i}`, true);
    });

    const serieses = d3AsSelectionArray(d3ImmediateChildren(marks, 'g'));
    marks.classed('ca-marks', true);
    if (this.json.chart.type === 'bar-chart') {
      serieses.forEach((series, seriesIndex) => {
        const bars = d3AsSelectionArray(d3ImmediateChildren(series, 'rect'));
        bars.forEach((bar, groupIndex) => {
          bar.classed(`ca-item ca-series ca-series-${seriesIndex} ca-group ca-group-${groupIndex}`, true);
          const value = this.json.dataset.rows[groupIndex][this.json.chart.yColumns[seriesIndex]];
          bar.attr('ca-data', value);
        });
      });
    } else if (this.json.chart.type === 'line-chart') {
      serieses.forEach((series, seriesIndex) => {
        const points = d3AsSelectionArray(d3ImmediateChildren(series, 'circle'));
        points.forEach((point, pointIndex) => {
          point.classed(`ca-item ca-series ca-series-${seriesIndex} ca-group ca-group-${pointIndex} ca-item-${pointIndex}`, true);
          const value = this.json.dataset.rows[pointIndex][this.json.chart.yColumns[seriesIndex]];
          point.attr('ca-data', value);
        });
        series.select('path').classed(`ca-series ca-series-${seriesIndex}`, true);
      });
    } else if (this.json.chart.type === 'scatterplot') {
      const points = d3AsSelectionArray(d3ImmediateChildren(serieses[0], 'circle'));
      const counter = new Counter();
      points.forEach((point, pointIndex) => {
        const seriesNames = items.map(item => item.select('text').text());
        const seriesName = this.json.dataset.rows[pointIndex][this.json.chart.groupColumn] as string;
        const seriesIndex = Math.max(seriesNames.indexOf(seriesName), 0);
        counter.addCount(seriesIndex);
        point.classed(`ca-item ca-series ca-series-${seriesIndex} ca-item-${counter.getCount(seriesIndex) - 1}`, true);
        const xValue = this.json.dataset.rows[pointIndex][this.json.chart.xColumn];
        const yValue = this.json.dataset.rows[pointIndex][this.json.chart.yColumn];
        point.attr('ca-data-x', xValue);
        point.attr('ca-data-y', yValue);
        point.attr('ca-data-extra', JSON.stringify(this.json.dataset.rows[pointIndex]));
      });
    }

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
    return this.svg;
    /*
    const annotations = uniqueAnnotationIds.map(id => annotationForeground.selectAll(`.${id}`));
    const specAnnotations = new Annotations();

    const chartAccentAnnotations = ca.annotations.annotations;

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
    };
  */
  }
}
