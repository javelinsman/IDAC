import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { ChartInfo } from './chart-info';

export class Title extends Tag {
  title: string;

  constructor(ca: ChartAccent) {
    super('title');
    this.title = ca.chart.title.text;
    this.description_rule = `Chart Title: $(title)`;
  }

}
