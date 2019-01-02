import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Title implements Tag {
  tagname: 'title';
  title: string;

  constructor(ca: ChartAccent) {
    this.tagname = 'title';
    this.title = ca.chart.title.text;
  }
}
