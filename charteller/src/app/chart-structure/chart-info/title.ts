import { ChartAccent } from '../chart-accent/chart-accent';

export class Title {
  tagname: 'title';
  title: string;

  constructor(ca: ChartAccent) {
    this.tagname = 'title';
    this.title = ca.chart.title.text;
  }
}
