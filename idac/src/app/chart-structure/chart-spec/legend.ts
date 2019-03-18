import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { Item } from './item';
import { d3Selection } from 'src/app/chartutils';

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
  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const legend = spec.select('.ca-legend');
    const items = legend.selectAll('.ca-item');
    const numItems = items.size();
    this.children = Array.from(Array(numItems)).map((_, index) => {
      return new Item(legend.select(`.ca-item-${index}`).text(), index, this._root, this);
    });
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
      ['The legend shows $(numChildren) series, named as following: $(children).', true],
      ['It indicates $(label).', false, ''],
    ]);

    this.children.forEach(child => child.afterFromSpecSVG());
  }
}
