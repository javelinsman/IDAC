import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput, makeAttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { d3Selection } from 'src/app/chartutils';
import { XTick } from './tick';

export class X extends SpecTag {
  constructor(public _root: ChartSpec) {
    super('X Axis');
    this._parent = _root;
    this.attributes = {
      label: new AttrInput(),
      unit: new AttrInput()
    };
    this.children = [] as XTick[];
    this.properties = {
      numChildren: () => this.children.length,
      children: () => this.children.map(d => d.foreignRepr()).join(', ')
    };
  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const axis = spec.select('.ca-x-axis');
    const label = spec.select('.ca-x-label');
    const unit = spec.select('.ca-x-unit');
    const numTicks = axis.selectAll('.ca-item').size();
    this.attributes = {
      label: makeAttrInput(() => label.select('text').text()),
      unit: makeAttrInput(() => unit.select('text').text()),
    };
    if (spec.attr('ca-chart-type') !== 'bar-chart') {
      this.attributes['rangeFrom'] = makeAttrInput(() =>
        axis.select('.ca-item-0').select('text').text());
      this.attributes['rangeTo'] = makeAttrInput(() =>
        axis.select(`.ca-item-${numTicks - 1}`).select('text').text());
    }
    this.children = Array.from(Array(numTicks)).map((_, index) => {
      return new XTick(axis.select(`.ca-item-${index}`).text(), index, this._root, this);
    });
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['X axis', true],
      [' indicates $(X Axis: label)', false],
      [' in $(X Axis: unit)', false, '.'],
      [' It measures $(numChildren) data as follows: $(children).', true],
    ]);
    this.children.forEach(child => child.afterFromSpecSVG());
  }
}
