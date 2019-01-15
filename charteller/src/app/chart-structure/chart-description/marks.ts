import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { X } from './x';
import { Y } from './y';

export class Marks extends Tag {
  constructor(ca: ChartAccent) {
    super('marks');

    this.children = ca.dataset.rows.map((row, index) => new Bargroup(row, index, ca));

    this.attributes = {
      numBargroups: this.children.length,
      numBars: this.children[0].children.length,
    };

    this.setDescriptionRule([
      'There are $(numBargroups) bargroups.',
      'Each bargroup contains $(numBars) bars.'
    ].join(' '));

  }
}

export class Bargroup extends Tag {
  name: string;
  relationalRanges: any[];
  children: Bar[];

  constructor(row: Row, index: number, ca: ChartAccent) {
    super('bargroup');

    const name = row[ca.dataset.columns[0].name] as string;
    this.children =  ca.dataset.columns.slice(1).map(column => column.name)
      .map((key, _index) => new Bar(ca, key, row, name, _index));

    const borrowX = new X(ca);
    const borrowY = new Y(ca);

    this.attributes = {
      name: name,
      index: index,
      numBars: this.children.length,
      sumOfBarValues: Math.round(10 * this.children.map(d => d.attributes.value).reduce((a, b) => a + b)) / 10,
      xLabel: borrowX.attributes.label,
      xUnit: borrowX.attributes.unit,
      yLabel: borrowY.attributes.label,
      yUnit: borrowY.attributes.unit,
    };

    this.setDescriptionRule([
      'A group of bar in $(name).',
      'It contains $(numBars) bars.',
      'The sum of all bars inside is $(sumOfBarValues) $(yUnit).',
    ].join(' '));

  }
}
export class Bar extends Tag {
  constructor(ca: ChartAccent, key: string, row: Row, bargroupName: string, index: number) {
    super('bar');

    const borrowX = new X(ca);
    const borrowY = new Y(ca);

    this.attributes = {
      seriesName: key,
      value: row[key],
      index: index,
      bargroupName: bargroupName,
      xLabel: borrowX.attributes.label,
      xUnit: borrowX.attributes.unit,
      yLabel: borrowY.attributes.label,
      yUnit: borrowY.attributes.unit,
    };

    this.setDescriptionRule([
      '$(value) at the bar series $(seriesName) in $(bargroupName).'
    ].join(' '));
  }
}
