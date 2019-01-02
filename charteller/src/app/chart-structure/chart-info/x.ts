import { ChartAccent } from '../chart-accent/chart-accent';

export class X {
  tagname: 'x';
  children: { tagname: 'tick' }[];
  label: string;
  lines: any[];
  ranges: any[];

  constructor(ca: ChartAccent) {
    this.tagname = 'x';
    this.label = ca.chart.xLabel.text;
    this.children = ca.dataset.rows.map(row => new Tick(row, ca));
    this.lines = [];
    this.ranges = [];
  }
}

export class Tick {
  tagname: 'tick';
  tick: string;

  constructor(row, ca: ChartAccent) {
    this.tagname = 'tick';
    this.tick = row[ca.dataset.columns[0].name];
    this.tick = '17';
  }
}
