import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { Item } from './item';
import { CoordinateLine } from './coordinate-line';
import { Bar } from './marks';
import { pearsonCorrelation } from 'src/app/utils';

export class TrendLine extends SpecTag {
  targets: Bar[] = [];
  active = true;
  constructor(
    public annotation: ChartAccent.Annotation,
    public _root: ChartSpec,
    public _parent: Annotations | CoordinateRange | CoordinateLine
  ) {
    super('Trend Line');
    this.attributes = {
      label: new AttrInput()
    };
    this.properties = {
      targetDescription: () => '',
      numTargets: () => ''
    };
  }

  fromChartAccent(ca: ChartAccent.ChartAccent) {
    const { targets, targetDescriptions, numTargets } = this.makeTargetInfo(ca);
    this.targets = targets;
    this.properties = {
      ...this.properties,
      targetDescription: () => targetDescriptions,
      numTargets: () => numTargets,
    };
  }

  afterFromChartAccent() {
    this.properties = {
      ...this.properties,
      trend: () => {
        let values;
        if (this._root.chartType === 'scatterplot') {
          values = this.targets.map(point => [point.properties.x(), point.properties.y()]);
        } else {
          values = this.targets.map((bar, i) => [i, +bar.properties.value()]);
        }
        const corr = pearsonCorrelation(values.map(d => +d[0]), values.map(d => +d[1]));
        if (corr >= 0.1) {
          return 'upward';
        } else if (corr <= -0.1) {
          return 'downward';
        } else { return 'constant'; }
      }
    };
    if (this._root.chartType === 'bar-chart') {
      this.descriptionRule = this.assembleDescriptionRules([
        ['A trend line goes $(trend) on $(numTargets) bars', true],
        [', labeled as "$(label)".', false, '.'],
        [' Specifically, the line is drawn over $(targetDescription).', true],
      ]);
    } else {
      this.descriptionRule = this.assembleDescriptionRules([
        ['A trend line goes $(trend) on $(numTargets) points', true],
        [', labeled as "$(label)".', false, '.'],
        [' Specifically, the line is drawn over $(targetDescription).', true],
      ]);
    }
  }

  getTargetLocation(ca: ChartAccent.ChartAccent): [Item, number[]][] {
    const locations = [];
    (this.annotation.target as ChartAccent.ItemsTarget).items.forEach(item => {
      const seriesIndex = +item.elements.slice(1) - 2;
      const series = this._root.legend.children[seriesIndex];
      const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
      locations.push([series, indices]);
      });
    if (this._root.chartType === 'scatterplot') {
      const aggr = {};
      locations.forEach(([series, indices]) => {
        indices.forEach(index => {
          const seriesName = ca.dataset.rows[index][ca.chart.groupColumn];
          const item = this._root.legend.children.find(item => item.properties.text() === seriesName);
          const itemIndex = this._root.legend.children.indexOf(item);
          const series = this._root.marks.children.find(_series => _series.properties.name() === seriesName);
          const newIndex = ca.dataset.rows.filter(row => row[ca.chart.groupColumn] === seriesName)
            .indexOf(ca.dataset.rows[index]);
          aggr[itemIndex] ? aggr[itemIndex].push(newIndex) : aggr[itemIndex] = [newIndex];
        });
      });
      const newLocations = [];
      Object.entries(aggr).forEach(([seriesIndex, indices]) => {
        const series = this._root.legend.children[seriesIndex];
        newLocations.push([series, indices])
      });
      return newLocations;
    } else {
      return locations;
    }
  }

  makeTargetInfo(ca: ChartAccent.ChartAccent) {
    const targets = [];
    const targetDescriptions = [];
    let numTargets = 0;
    this.getTargetLocation(ca).forEach(([series, indices]) => {
      if (this._root.chartType === 'bar-chart') {
        indices.forEach(index => targets.push(this._root.marks.children[index].children[series.properties.index0()]));
        const seriesName = series.properties.text();
        targetDescriptions.push(`${indices.length === this._root.marks.children.length ?
          'all bars' : `${indices.map(i => i + 1).join(', ')}-th position`} in ${seriesName}`);
      } else {
        indices.forEach(index => targets.push(this._root.marks.children[series.properties.index0()].children[index]));
        const seriesName = series.properties.text();
        targetDescriptions.push(`${indices.length === this._root.marks.children[0].children.length ?
          'all points' : `${indices.length} points`} in ${seriesName}`);
      }
      numTargets += indices.length;
    });
    return {
      targets,
      targetDescriptions: targetDescriptions.join(', '),
      numTargets
    };
  }

}
