import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';

export class X extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('X Axis');
        this._parent = _root;
        this.attributes = {
            label: new AttrInput(),
            unit: new AttrInput()
        };
        this.children = [] as Tick[];
        this.properties = {
            numChildren: () => this.children.length,
            children: () => this.children.map(d => d.foreignRepr()).join(', ')
        };
        this.descriptionRule = [
            'X axis indicates $(X Axis: label) in $(X Axis: unit), measuring $(numChildren) bar groups as follows: $(children).'
        ];

    }
    fromChartAccent(ca: ChartAccent) {
        this.attributes = {
            label: new AttrInput(ca.chart.xLabel.text.split('(')[0].trim()),
            unit: new AttrInput(ca.chart.xLabel.text.split('(')
            .slice(1).join('(').slice(0, -1).split(':').slice(1).join(':').trim())
        };
        this.children = ca.dataset.rows.map((row, index) => new Tick(
            row[ca.dataset.columns[0].name], index, this._root, this));
    }
}

export class Tick extends SpecTag {
    constructor(tick: string | number, index: number, public _root: ChartSpec, public _parent: X) {
        super('Tick');
        this.attributes = {
            text: new AttrInput(tick),
        };
        this.properties = {
            index0: () => index,
            index1: () => index + 1
        };
        this.descriptionRule = [
          '$(text) $(X Axis: unit), which indicates $(X Axis: label).'
        ];
    }

    foreignRepr() {
        return this.attributes.text.value;
    }
}
