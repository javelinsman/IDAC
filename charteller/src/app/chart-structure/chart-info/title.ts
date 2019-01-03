import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { ChartInfo } from './chart-info';

export class Title extends Tag {
  constructor(ca: ChartAccent) {
    super({
      tagname: 'title',
      description_rule: `Chart Title: $(title)`,
      attributes: {
        title: ca.chart.title.text,
      }
    });
  }

}
