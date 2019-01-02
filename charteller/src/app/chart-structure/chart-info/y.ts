import { ChartAccent } from '../chart-accent/chart-accent';
import { AnnotatedTag } from './annotated-tag';

export class Y implements AnnotatedTag {
  tagname: 'y';
  min: number;
  max: number;
  label: string;
  unit: string;
  lines: any[]; // annotation
  ranges: any[]; // annotation

  constructor(ca: ChartAccent) {
    this.tagname = 'y';
    this.min = ca.chart.yScale.min;
    this.max = ca.chart.yScale.max;
    this.label = ca.chart.yLabel.text.split('(')[0].trim();
    this.unit = ca.chart.yLabel.text.split('(')
      .slice(1).join('(').slice(0, -1).split(':').slice(1).join(':').trim();
    this.lines = [];
    this.ranges = [];
    this.fetchAnnotations(ca);
  }

  fetchAnnotations(ca: ChartAccent): void {
  }
}
