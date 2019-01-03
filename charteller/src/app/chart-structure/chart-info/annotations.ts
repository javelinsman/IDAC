import { ChartAccent } from '../chart-accent/chart-accent';

export class Annotations {
  tagname: 'annotations';
  children: Annotation[];
  constructor(ca: ChartAccent) {
    this.tagname = 'annotations';
    this.children = [];
  }
}
export class Annotation {
  [key: string]: any;
}
