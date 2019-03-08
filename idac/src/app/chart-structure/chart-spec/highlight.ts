import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { CoordinateLine } from './coordinate-line';
import { Item } from './item';

export class Highlight extends SpecTag {
  active = true;

  constructor(
    public annotation: ChartAccent.Annotation,
    public _root: ChartSpec,
    public _parent: Annotations | CoordinateRange | CoordinateLine
  ) {
    super('Highlight');
    this.attributes = {
      itemLabel: new AttrInputSelect(['on', 'off'], 'off'),
      highlight: new AttrInputSelect(['emphasize', 'de-emphasize', 'off'], 'off'),
      label: new AttrInput()
    };
    this.properties = {
      targetDescription: () => '',
      numTargets: () => '',
      itemLabel: () => '',
      highlight: () => ''
    };

  }

  fromChartAccent(ca: ChartAccent.ChartAccent) {
    const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
    this.attributes.itemLabel.value = itemLabel.visible ? 'on' : 'off';
    const highlight = this.annotation.components.find(d => d.type === 'highlight');
    if (highlight.visible) {
      if (highlight.style.fill.value < 0 || highlight.style.stroke_width > 0) {
        this.attributes.highlight.value = 'emphasize';
      } else if (highlight.style.fill.value > 0 && highlight.style.stroke_width <= 0) {
        this.attributes.highlight.value = 'de-emphasize';
      } else {
        this.attributes.highlight.value = 'off';
      }
    } else {
      this.attributes.highlight.value = 'off';
    }
    const { target, numTargets } = this.makeTargetInfo(ca);
    this.properties = {
      ...this.properties,
      targetDescription: () => target,
      numTargets: () => numTargets,
      itemLabel: () => this.attributes.itemLabel.value === 'on'
        ? 'Item labels are marked on them.' : '',
      highlight: () => {
        if (this.attributes.highlight.value === 'emphasize') {
          return 'They are highlighted.';
        } else if (this.attributes.highlight.value === 'de-emphasize') {
          return 'They are de-emphasized.';
        } else {
          return '';
        }
      }
    };
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
    let numTargets = 0;
    this.getTargetLocation(ca).forEach(([series, indices]) => {
      const seriesName = series.properties.text();
      if (this._root.chartType === 'bar-chart') {
        targets.push(`${indices.length === this._root.marks.children.length ?
          'all bars' : `${indices.map(i => i + 1).join(', ')}-th position`} in ${seriesName}`);
      } else {
        const seriesIndex = this._root.legend.children.indexOf(series);
        targets.push(`${indices.length === this._root.marks.children[seriesIndex].children.length ?
          'all points' : `${indices.length} points`} in ${seriesName}`);
      }
      numTargets += indices.length;
    });
    return {
      target: targets.join(', and '),
      numTargets
    };
    }

  afterFromChartAccent() {
    if (this._root.chartType === 'bar-chart') {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(numTargets) bars are annotated', true],
        [', labeled as "$(label)".', false, '.'],
        [' $(highlight)', true],
        [' $(itemLabel)', true],
        [' Specifically, targets are $(targetDescription).', true],
      ]);
    } else {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(numTargets) points are annotated', true],
        [', labeled as "$(label)".', false, '.'],
        [' $(highlight)', true],
        [' $(itemLabel)', true],
        [' Specifically, targets are $(targetDescription).', true],
      ]);
    }
  }



}
