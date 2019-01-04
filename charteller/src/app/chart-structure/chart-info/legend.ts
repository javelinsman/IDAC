import { ChartAccent, ItemsTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Legend extends Tag {
  constructor(ca: ChartAccent) {
    super('legend');
    this.children = ca.chart.yColumns.map(item => new Item(item));
    this.attributes.num_children = this.children.length;
    this.attributes.list_children = this.children.map(d => d.attributes.item).join(', ');
    this.descriptionRule = [
      '$(num_children) legend items: $(list_children)',
    ].join(' ');
  }
}

export class Item extends Tag {

  constructor(item: string) {
    super('item');
    this.attributes.item = item;
    this.descriptionRule = '$(item).';
  }
}

