import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput, makeAttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { d3Selection } from 'src/app/chartutils';
import { d3AsSelectionArray } from 'src/app/utils';
import { YTick } from './tick';

export class Y extends SpecTag {
  constructor(public _root: ChartSpec) {
    super('Y Axis');
    this._parent = _root;
    this.attributes = {
      label: new AttrInput(),
      unit: new AttrInput(),
      rangeFrom: new AttrInput(),
      rangeTo: new AttrInput(),
    };

  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const axis = spec.select('.ca-y-axis');
    const label = spec.select('.ca-y-label');
    const unit = spec.select('.ca-y-unit');
    const numTicks = axis.selectAll('.ca-item').size();
    this.attributes = {
      label: makeAttrInput(() => label.select('text').text()),
      unit: makeAttrInput(() => unit.select('text').text()),
      rangeFrom: makeAttrInput(() =>
        axis.select('.ca-item-0').select('text').text()),
      rangeTo: makeAttrInput(() =>
        axis.select(`.ca-item-${numTicks - 1}`).select('text').text()),
    };
    const ticks = Array.from(Array(numTicks))
      .map((_, index) => axis.select(`.ca-item-${index}`).text());
    this.children = [new YTick(ticks, this._root, this)];
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['Y axis indicates $(Y Axis: label)', true],
      [' in $(Y Axis: unit).', false, '.'],
      [' The data ranges from $(Y Axis: rangeFrom) to $(Y Axis: rangeTo)', true, ''],
      [' $(Y Axis: unit).', false, '.'],
    ]);
    this.children.forEach(child => child.afterFromSpecSVG());
  }

  _foreignRepr() {
    return this._tagname;
  }
}
