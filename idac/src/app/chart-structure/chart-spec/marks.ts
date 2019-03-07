import { SpecTag } from './spec-tag';
import { AttrInputSelect, AttrInput } from './attributes';
import { ChartSpec } from './chart-spec';
import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Item } from './item';
import { Tick } from './tick';
import { d3Selection, caSpecDistinctClasses } from 'src/app/chartutils';
import { d3AsSelectionArray } from 'src/app/utils';

export class Marks extends SpecTag {
  constructor(public _root: ChartSpec) {
    super('Marks');
    this._parent = _root;
    this.children = [] as Bargroup[];
    this.attributes = {
      // type: new AttrInputSelect(['grouped', 'stacked'], 'grouped')
    };
    this.properties = {
      numBarGroups: () => this.children.length,
      numBars: () => this.children.length ? this.children[0].children.length : 0,
    };

  }
  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const chartType = spec.attr('ca-chart-type');
    const marks = spec.select('.ca-marks');
    console.log(d3AsSelectionArray(marks.selectAll('.ca-group')));
    const groups = caSpecDistinctClasses(marks, 'ca-group');
    const numGroups = groups.length;
    const serieses = caSpecDistinctClasses(marks, 'ca-series');
    const numSeries = serieses.length;
    if (chartType === 'bar-chart') {
      this.children = Array.from(Array(numGroups)).map((_, index) => {
        return new Bargroup(index, this._root, this);
      });
      this.children.forEach(child => child.fromSpecSVG(spec));
    } else {
      this.children = Array.from(Array(numSeries)).map((_, index) => {
        return new Series(index, this._root, this);
      });
      this.children.forEach(child => child.fromSpecSVG(spec));
    }
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
    ['There are $(numBarGroups) bar groups', true],
    [', which correspond to each $(X Axis: label).', false, '.'],
    [' And each bar group contains $(numBars) bars', true],
    [', which correspond to each series of $(Legend: label).', false, '.'],
    ]);
    this.children.forEach(child => child.afterFromSpecSVG());
  }
}

export class Bargroup extends SpecTag {
  borrowX = this._root.x;
  borrowY = this._root.y;
  borrowLegend = this._root.legend;
  constructor(private index: number, public _root: ChartSpec, public _parent: Marks) {
    super('Bar Group');
    this.properties = {
      name: () => this.borrowX.children[index].attributes.text.value,
      numBars: () => this.children.length,
      sumOfBarValues: () => Math.round(
          10 * this.children.map(d => d.properties.value() as number).reduce((a, b) => a + b)
        ) / 10,
      index0: () => this.index,
      index1: () => this.index + 1,
    };
    this.children = [];
  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    this.children = this.borrowLegend.children.map((item: Item, itemIndex: number) => {
      const key = item;
      const value = +spec.select('.ca-marks')
        .select(`.ca-group-${this.index}.ca-series-${itemIndex}`)
        .attr('ca-data');
      return new Bar(key, value, itemIndex, this._root, this);
    });
  }
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['A bar group in $(name).', true],
      [' It contains $(numBars) bars.', true],
      [' The sum of all bars inside is $(sumOfBarValues).', true],
      [' Each bar indicates $(Y Axis: label)', false, ''],
      [' in $(Y Axis: unit).', false, '.'],
    ]);
    this.children.forEach(child => child.afterFromSpecSVG());
  }
}

export class Bar extends SpecTag {
  constructor(key: Item, value: number, index: number, public _root: ChartSpec, public _parent: Bargroup) {
    super('Bar');
    this.attributes = {
      value: new AttrInput(value)
    };
    this.properties = {
      seriesName: () => key.attributes.text.value,
      index0: () => index,
      index1: () => index + 1
    };
  }
  foreignRepr() {
    return `${this.properties.seriesName()}:${this.properties.key()}`;
  }
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
    ['$(value)', true],
    [' $(Y Axis: unit)', false, ''],
    [' for $(seriesName) in $(Bar Group: name).', true],
    ]);
  }
}

export class Series extends SpecTag {
  borrowX = this._root.x;
  borrowY = this._root.y;
  borrowLegend = this._root.legend;
  constructor(private index: number, public _root: ChartSpec, public _parent: Marks) {
    super('Series');
    this.properties = {
      name: () => this.borrowLegend.children[index].attributes.text.value,
      numPoints: () => this.children.length,
      index0: () => index,
      index1: () => index + 1,
    };
    this.children = [];
  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const points = caSpecDistinctClasses(
      spec.selectAll(`.ca-marks .ca-series-${this.index}`),
      'ca-item',
      true
    );
    const numPoints = points.length;
    this.children = Array.from(Array(numPoints)).map((_, pointIndex) => {
      return new Point(this.index, pointIndex, this._root, this);
    });
    this.children.forEach(child => child.fromSpecSVG(spec));
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
    ['A series named $(name).', true],
    [' It contains $(numPoints) points', true],
    [', each indicating $(Y Axis: label)', false, ''],
    [' in $(Y Axis: unit).', false, '.'],
    ]);
    this.children.forEach(child => child.afterFromSpecSVG());
  }
}

export class Point extends SpecTag {
  constructor(private seriesIndex: number, private pointIndex: number, public _root: ChartSpec, public _parent: Series) {
    super('Point');
  }
  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    if (spec.attr('ca-chart-type') === 'line-chart') {
      const key = this._root.x.children[this.pointIndex];
      const value = spec.select(`.ca-marks .ca-series-${this.seriesIndex}.ca-item-${this.pointIndex}`)
        .attr('ca-data');
      this.attributes = {
        value: new AttrInput(value)
      };
      this.properties = {
        tickName: () => key.attributes.text.value,
        index0: () => this.pointIndex,
        index1: () => this.pointIndex + 1
      };
    } else {
      const point = spec.select(`.ca-marks .ca-series-${this.seriesIndex}.ca-item-${this.pointIndex}`)
      const x = point.attr('ca-data-x');
      const y = point.attr('ca-data-y');
      this.properties = {
        x: () => x,
        y: () => y
      };
    }
  }
  foreignRepr() {
    return `${this.properties.seriesName()}:${this.properties.key()}`;
  }
  afterFromSpecSVG() {
    if (this._root.chartType === 'line-chart') {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(value)', true],
        [' $(Y Axis: unit)', false, ''],
        [' for $(tickName) in $(Series: name).', true],
      ]);
    } else {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(X Axis: label) is $(x) ', true],
        ['$(X Axis: unit) ', false, ''],
        ['and $(Y Axis: label) is $(y) ', true],
        ['$(Y Axis: unit) ', false, ''],
        ['in series $(Series: name).', true],
      ]);
    }
  }
}
