import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Marks extends Tag {
  constructor(ca: ChartAccent) {
    super('marks');
    this.children = ca.dataset.rows.map(row => new Bargroup(row, ca));
    this.descriptionRule = [
      'There are $(num_bargroups) bargroups.',
      'Each bargroup contains $(num_bars) bars.',
    ].join(' ');
    this.attributes.num_bargroups = this.children.length;
    this.attributes.num_bars = this.children[0].children.length;
  }
}

export class Bargroup extends Tag {
  name: string;
  relationalRanges: any[];
  children: Bar[];

  constructor(row: Row, ca: ChartAccent) {
    super('bargroup');

    const tick = row[ca.dataset.columns[0].name] as string;
    this.children =  ca.dataset.columns.slice(1).map(column => column.name)
      .map(key => new Bar(key, row, tick));

    this.attributes.tick = tick;
    this.attributes.num_bars = this.children.length;

    this.descriptionRule = [
      'A group of bar in $(tick).',
      'It contains $(num_bars) bars.',
    ].join(' ');
  }
}
export class Bar extends Tag {
  constructor(key: string, row: Row, bargroup_name: string) {
    super('bar');
    this.attributes.key = key;
    this.attributes.value = row[key];
    this.attributes.bargroup_name = bargroup_name;
    // TODO: unit_y
    this.descriptionRule = [
      '$(value) at a bar $(key) in $(bargroup_name).'
    ].join(' ');
  }
}
