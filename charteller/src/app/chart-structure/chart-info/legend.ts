import { ChartAccent, ItemsTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Legend implements Tag {
  tagname: 'legend';
  children: Item[];
  constructor(ca: ChartAccent) {
    this.tagname = 'legend';
    this.children = ca.chart.yColumns.map(item => new Item(item));
    this.fetchAnnotations(ca);
  }
  fetchAnnotations(ca: ChartAccent) {
    ca.annotations.annotations.forEach((annotation, annotation_id: number) => {
      if (!annotation.target_inherit && annotation.target.type === 'items') {
        annotation.components.forEach(components => {
          if (components.visible && components.type === 'trendline') {
            (annotation.target as ItemsTarget).items.forEach(item => {
              const series = +(item.elements.slice(1)) - 2;
              const trendlineItem = this.children[series];
              trendlineItem.trendline = true;
              trendlineItem['_annotation'] = annotation;
            });
          }
        });
      }
    });
  }
}

export class Item {
  tagname: 'item';
  item: string;
  trendline: boolean;

  constructor(item: string) {
      this.tagname = 'item';
      this.item = item;
      this.trendline = false;
  }
}

