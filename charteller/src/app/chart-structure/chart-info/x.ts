import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class X extends Tag {

  constructor(ca: ChartAccent) {
    super('x');
    this.setDescriptionRule([
      'X axis with label named $(label).',
      'There are $(num_children) tick marks: $(list_children).',
    ].join(' '));

    this.children = ca.dataset.rows.map(row => new Tick(row, ca));
    this.attributes.label = ca.chart.xLabel.text;
    this.attributes.num_children = this.children.length;
    this.attributes.list_children = this.children
      .map(d => d.attributes.tick).join(', ');
  }
}

export class Tick extends Tag {
  constructor(row: Row, ca: ChartAccent) {
    super('tick');
    this.setDescriptionRule([
      '$(tick)'
    ].join(' '));

    this.attributes.tick = row[ca.dataset.columns[0].name];
  }
}
