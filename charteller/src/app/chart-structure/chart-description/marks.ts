import { Tag } from './tag';
import { X } from './x';
import { Y } from './y';
import * as ChartSpec from '../chart-spec/chart-spec';

export class Marks extends Tag {
  constructor(cs: ChartSpec.ChartSpec) {
    super('marks');

    this.children = cs.marks.bargroups.value.map((bargroup, index) => new Bargroup(bargroup, index, cs));

    this.attributes = {
      numBargroups: this.children.length,
      numBars: this.children.length ? this.children[0].children.length : 0,
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

  constructor(bargroup: ChartSpec.Bargroup, index: number, cs: ChartSpec.ChartSpec) {
    super('bargroup');

    const name = bargroup.name.value.text.value;
    this.children =  bargroup.bars.value.map((bar, _index) => new Bar(bar, _index, cs));

    const borrowX = new X(cs);
    const borrowY = new Y(cs);

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
  constructor(bar: ChartSpec.Bar, index: number, cs: ChartSpec.ChartSpec) {
    super('bar');

    const borrowX = new X(cs);
    const borrowY = new Y(cs);

    this.attributes = {
      seriesName: bar.key.value.text.value,
      value: bar.value.value,
      index: index,
      bargroupName: bar._parent.name.value.text.value,
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
