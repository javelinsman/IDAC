import { Tag } from './tag';
import * as ChartSpec from '../chart-spec/chart-spec';

export class Legend extends Tag {
  constructor(cs: ChartSpec.ChartSpec) {
    super('legend');
    this.children = cs.legend.items.value.map((item, index) => new Item(item, index));

    this.attributes = {
      numItems: this.children.length,
      listOfItems: this.children.map(d => d.attributes.item).join(', '),
    };

    this.setDescriptionRule([
      '$(numItems) legend items: $(listOfItems)',
    ].join(' '));
  }
}

export class Item extends Tag {

  constructor(item: ChartSpec.Item, index: number) {
    super('item');

    this.attributes = {
      item: item.text.value,
      index: index,
    };

    this.setDescriptionRule('$(item).');
  }
}

