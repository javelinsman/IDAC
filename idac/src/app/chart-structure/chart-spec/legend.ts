import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';

export class Legend extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('Legend');
        this.attributes = {
            label: new AttrInput()
        };
        this.properties = {
            numChildren: () => this.children.length,
            listOfChildren: () => this.children.map(d => d.foreignRepr()).join(', ')
        };
        this.children = [] as Item[];
        this.descriptionRule = '$(numChildren) legend items: $(listOfChildren).';
    }
    fromChartAccent(ca: ChartAccent) {
        this.children = ca.chart.yColumns.map((item, index) => new Item(item, this._root, this));
    }
}

export class Item extends SpecTag {
    constructor(text: string | number, public _root: ChartSpec, public _parent: Legend) {
        super('Item');
        this.attributes = {
            text: new AttrInput(text)
        };
        this.descriptionRule = '$(text)';
    }
    foreignRepr() {
        return this.attributes.text.value;
    }
}
