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
    afterFromChartAccent() {
        this.descriptionRule = this.assembleDescriptionRules([
            ['X axis indicates $(X Axis: label)', true],
            [' in $(X Axis: unit)', false, ''],
            [', measuring $(numChildren) data as follows: $(children).', true],
        ]);
        this.children.forEach(child => child.afterFromChartAccent());
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
    }

    foreignRepr() {
        return this.attributes.text.value;
    }
    afterFromChartAccent() {
        this.descriptionRule = this.assembleDescriptionRules([
          ['$(text)', true],
          ['$(X Axis: unit)', false, ''],
          [', which indicates $(X Axis: label).', false, '.'],
        ]);
    }
}
