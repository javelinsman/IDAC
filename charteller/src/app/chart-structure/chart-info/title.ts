import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Title extends Tag {
  constructor(ca: ChartAccent) {
    super('title');
    this.descriptionRule = 'Chart title: $(title).';
    this.attributes = {
      title: ca.chart.title.text,
    };
  }

}
