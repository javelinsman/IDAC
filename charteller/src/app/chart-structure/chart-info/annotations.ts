import { ChartAccent } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Annotations implements Tag {
  tagname: 'annotations';
  children: Annotation[];
  constructor(ca: ChartAccent) {
    this.tagname = 'annotations';
    this.children = [];
  }
}

type Annotation = Tag;
