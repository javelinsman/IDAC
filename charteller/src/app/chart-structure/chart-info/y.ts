import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Y extends Tag {
  tagname: 'y';
  min: number;
  max: number;
  label: string;
  unit: string;

  constructor(ca: ChartAccent) {
    super('y');
    this.setDescriptionRule([
      'Y axis with label named $(label).',
      'The unit of measurement is $(unit).',
      'The range is from $(min) to $(max).',
    ].join(' '));
    this.attributes.min = ca.chart.yScale.min;
    this.attributes.max = ca.chart.yScale.max;
    this.attributes.label = ca.chart.yLabel.text.split('(')[0].trim();
    this.attributes.unit = ca.chart.yLabel.text.split('(')
      .slice(1).join('(').slice(0, -1).split(':').slice(1).join(':').trim();
  }
}
