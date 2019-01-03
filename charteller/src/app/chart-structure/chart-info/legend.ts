import { ChartAccent, ItemsTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Legend extends Tag {
  constructor(ca: ChartAccent) {
    super('legend');
    this.children = ca.chart.yColumns.map(item => new Item(item));
    this.attributes.num_children = this.children.length;
    this.attributes.list_children = this.children.map(d => d.attributes.item).join(', ');
    this.description_rule = [
      '범례 항목 $(num_children)개: $(list_children)',
    ].join(' ');
  }
  /*
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
  */
}

export class Item extends Tag {

  constructor(item: string) {
    super('item');
    this.attributes.item = item;
    this.description_rule = '$(item).';
  }
}

