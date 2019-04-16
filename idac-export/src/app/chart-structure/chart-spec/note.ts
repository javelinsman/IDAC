import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { CoordinateLine } from './coordinate-line';

export class Note extends SpecTag {
  active = true;

  constructor(
    public annotation: ChartAccent.Annotation,
    public _root: ChartSpec,
    public _parent: Annotations | CoordinateRange | CoordinateLine
  ) {
    super('Note');
    this.attributes = {
      label: new AttrInput('')
    };
    this.descriptionRule = this.assembleDescriptionRules([
      ['$(label)', true],
    ]);
  }

  fromChartAccent(ca: ChartAccent.ChartAccent) {
  }

  afterFromChartAccent() {
  }

}
