import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';

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
    this.descriptionRule = [
      'Y axis indicates $(Y Axis: label)  in $(Y Axis: unit).',
      'The data range from $(Y Axis: rangeFrom) to $(Y Axis: rangeTo)  $(Y Axis: unit).'
    ].join(' ');
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

  afterFromChartAccent() {
    const allValues = this._root.marks.children.map(bargroup => bargroup.children.map(bar => bar.properties.value() as number))
      .reduce((a, b) => [...a, ...b]);
    if (!this.attributes.rangeFrom || !this.attributes.rangeTo) {
      this.properties.rangeTo = () => Math.ceil(Math.max(...allValues));
      this.properties.rangeFrom = () => Math.floor(Math.min(...allValues));
    }

  }
  _foreignRepr() {
    return this._tagname;
  }
}
