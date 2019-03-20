import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput } from './attributes';

export class Tick extends SpecTag {
  constructor(ticks: (string | number)[], public _root: ChartSpec, public _parent: SpecTag) {
    super('Tick');
    this.attributes = {
      ticks: new AttrInput(ticks.join(', ')),
      numTicks: new AttrInput(ticks.length),
    };
  }

  foreignRepr() {
    return this.attributes.ticks.value;
  }
}

export class XTick extends Tick {
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['There are $(numTicks) tick labels: $(ticks).', true]
    ]);
  }
}

export class YTick extends Tick {
  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['There are $(numTicks) tick labels: $(ticks).', true]
    ]);
  }
}
