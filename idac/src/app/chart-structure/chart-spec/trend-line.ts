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
    const { targets, targetDescriptions, numTargets } = this.makeTargetInfo();
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

  getTargetLocation(): [Item, number[]][] {
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
          const lengths = this._root.marks.children.map(series => series.children.length);
          const convert = (series, index, lengths) => {
            for (let i = 0; i < lengths.length; i++) {
              const length = lengths[i];
              if (index >= length) {
                index -= length;
              } else {
                return [i, index];
              }
            }
          };
          [series, index] = convert(series, index, lengths);
          aggr[series] ? aggr[series].push(index) : aggr[series] = [index];
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

  makeTargetInfo() {
    const targets = [];
    const targetDescriptions = [];
    let numTargets = 0;
    this.getTargetLocation().forEach(([series, indices]) => {
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
      targetDescriptions: targetDescriptions.join(', and '),
      numTargets
    };
  }

}
