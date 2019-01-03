import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { ChartInfo } from './chart-info';

export class Title extends Tag {
  constructor(ca: ChartAccent) {
    super('title');
    this.description_rule = 'Chart title: $(title).';
    this.attributes = {
      title: ca.chart.title.text,
    };
  }

}
