import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';

export class Legend extends SpecTag {
  constructor(public _root: ChartSpec) {
    super('Legend');
    this._parent = _root;
    this.attributes = {
      label: new AttrInput()
    };
    this.properties = {
      numChildren: () => this.children.length,
      children: () => this.children.map(d => d.foreignRepr()).join(', ')
    };
    this.children = [] as Item[];
  }
  fromChartAccent(ca: ChartAccent) {
    this.children = ca.chart.yColumns.map((item, index) => new Item(item, index, this._root, this));
  }
  afterFromChartAccent() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['The legend shows $(numChildren) series, named as follows: $(children).', true],
      ['It indicates $(label).', false, ''],
    ]);

    this.children.forEach(child => child.afterFromChartAccent());
  }
}

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
    afterFromChartAccent() {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(text)', true],
        [', which indicates $(Legend: label).', false, '.'],
      ]);
    }
}
