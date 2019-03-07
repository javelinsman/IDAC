import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput, makeAttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { d3Selection } from 'src/app/chartutils';
import { d3AsSelectionArray } from 'src/app/utils';

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

  fromChartAccent(ca: ChartAccent) {
    this.attributes = {
      label: new AttrInput(ca.chart.yLabel.text.split('(')[0].trim()),
      unit: new AttrInput(ca.chart.yLabel.text.split('(')
        .slice(1).join('(').slice(0, -1).trim()),
      rangeTo: new AttrInput(ca.chart.yScale.max),
      rangeFrom: new AttrInput(ca.chart.yScale.min)
    };
  }
  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const axis = spec.select('.ca-y-axis');
    const label = spec.select('.ca-y-label');
    const unit = spec.select('.ca-y-unit');
    const numTicks = axis.selectAll('.ca-item').size()
    console.log({ axis, label, unit });
    this.attributes = {
      label: makeAttrInput(() => label.select('text').text()),
      unit: makeAttrInput(() => unit.select('text').text()),
      rangeFrom: makeAttrInput(() =>
        axis.select('.ca-item-0').select('text').text()),
      rangeTo: makeAttrInput(() =>
        axis.select(`.ca-item-${numTicks - 1}`).select('text').text()),
    };
  }

  afterFromChartAccent() {
    const allValues = this._root.marks.children.map(bargroup => bargroup.children.map(bar => bar.properties.value() as number))
      .reduce((a, b) => [...a, ...b]);
    if (!this.attributes.rangeFrom.value || !this.attributes.rangeTo.value) {
      this.properties.rangeTo = () => Math.ceil(Math.max(...allValues));
      this.properties.rangeFrom = () => 0; // Math.floor(Math.min(...allValues));
    }

    this.descriptionRule = this.assembleDescriptionRules([
      ['Y axis indicates $(Y Axis: label)', true],
      [' in $(Y Axis: unit).', false, '.'],
      [' The data range from $(Y Axis: rangeFrom) to $(Y Axis: rangeTo)', true, ''],
      [' $(Y Axis: unit).', false, '.'],
    ]);
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['Y axis indicates $(Y Axis: label)', true],
      [' in $(Y Axis: unit).', false, '.'],
      [' The data range from $(Y Axis: rangeFrom) to $(Y Axis: rangeTo)', true, ''],
      [' $(Y Axis: unit).', false, '.'],
    ]);
  }

  _foreignRepr() {
    return this._tagname;
  }
}
