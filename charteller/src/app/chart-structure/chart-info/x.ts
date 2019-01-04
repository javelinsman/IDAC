import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class X extends Tag {

  constructor(ca: ChartAccent) {
    super('x');
    this.children = ca.dataset.rows.map((row, index) => new Tick(row, index, ca));
    this.attributes = {
      label: ca.chart.xLabel.text.split('(')[0].trim(),
      unit: ca.chart.xLabel.text.split('(')
        .slice(1).join('(').slice(0, -1).split(':').slice(1).join(':').trim(),
      numTicks: this.children.length,
      listOfTicks: this.children.map(d => d.attributes.tick).join(', ')
    };
    this.setDescriptionRule([
      'X axis with label name $(label).',
      'The unit of measurement is $(unit).',
      'There are $(numTicks) tick marks: $(listOfTicks).',
    ].join(' '));

    if (!this.attributes.label) {
      this.attributes.label = 'not specified';
    }
    if (!this.attributes.unit) {
      this.attributes.unit = 'not specified';
    }

  }
}

export class Tick extends Tag {
  constructor(row: Row, index: number, ca: ChartAccent) {
    super('tick');
    this.setDescriptionRule([
      '$(tick) $(unit)'
    ].join(' '));

    this.attributes = {
      tick: row[ca.dataset.columns[0].name],
      unit: ca.chart.xLabel.text.split('(')
        .slice(1).join('(').slice(0, -1).split(':').slice(1).join(':').trim(),
      index: index,
    };
  }
}
