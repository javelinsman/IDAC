import { Legend } from './legend';
import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput } from './attributes';

export class Item extends SpecTag {
  constructor(text: string | number, index: number, public _root: ChartSpec, public _parent: Legend) {
    super('Item');
    this.attributes = {
      text: new AttrInput(text),
    };
    this.properties = {
      index0: () => index,
      index1: () => index + 1
    };
  }
  foreignRepr() {
    return this.attributes.text.value;
  }
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['$(text)', true],
      [', which indicates $(Legend: label).', false, '.'],
    ]);
  }
}
