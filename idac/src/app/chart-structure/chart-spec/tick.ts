import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput } from './attributes';

export class Tick extends SpecTag {
  constructor(tick: string | number, index: number, public _root: ChartSpec, public _parent: SpecTag) {
    super('Tick');
    this.attributes = {
      text: new AttrInput(tick),
    };
    this.properties = {
      index0: () => index,
      index1: () => index + 1
    };
  }

  foreignRepr() {
    return this.attributes.text.value;
  }
}

export class XTick extends Tick {
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['$(text)', true],
      ['$(X Axis: unit)', false, ''],
      [', which indicates $(X Axis: label).', false, '.'],
    ]);
  }
}

export class YTick extends Tick {
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['$(text)', true],
      ['$(Y Axis: unit)', false, ''],
      [', which indicates $(Y Axis: label).', false, '.'],
    ]);
  }
}
