import { SpecTag } from './spec-tag';
import { AttrInputSelect, AttrInput } from './attributes';
import { ChartSpec } from './chart-spec';
import { ChartAccent, Row } from '../chart-accent/chart-accent';
import { Item } from './legend';

export class Marks extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('Marks');
        this._parent = _root;
        this.children = [] as Bargroup[];
        this.attributes = {
            // type: new AttrInputSelect(['grouped', 'stacked'], 'grouped')
        };
        this.properties = {
            numBarGroups: () => this.children.length,
            numBars: () => this.children.length ? this.children[0].children.length : 0,
        };
        this.descriptionRule = [
            'There are $(numBarGroups) bar groups, which correspond to each $(X Axis: label).',
            'And each bar group contains $(numBars) bars, which correspond to each series of $(Legend: label).'
        ];
    }
    fromChartAccent(ca: ChartAccent) {
        this.children = ca.dataset.rows.map((row, index) => new Bargroup(row, index, this._root, this));
    }
}

export class Bargroup extends SpecTag {
    borrowX = this._root.x;
    borrowY = this._root.y;
    borrowLegend = this._root.legend;
    constructor(private row: Row, index: number, public _root: ChartSpec, public _parent: Marks) {
        super('Bar Group');
        this.properties = {
            name: () => this.borrowX.children[index].attributes.text.value,
            numBars: () => this.children.length,
            sumOfBarValues: () => Math.round(
                    10 * this.children.map(d => d.properties.value() as number).reduce((a, b) => a + b)
                ) / 10,
            index0: () => index,
            index1: () => index + 1,
        };
        this.children = this.borrowLegend.children.map((item: Item, index2: number) => {
            const key = item;
            const value = +row[key.attributes.text.value];
            return new Bar(key, value, index2, this._root, this);
        });
        this.descriptionRule = [
            'A bar group in $(name).',
            'It contains $(numBars) bars.',
            'The sum of all bars inside is $(sumOfBarValues) $(Y Axis: unit), indicating $(Y Axis: label).'
        ];
    }
}

export class Bar extends SpecTag {
    constructor(key: Item, value: number, index: number, public _root: ChartSpec, public _parent: Bargroup) {
        super('Bar');
        this.attributes = {
            value: new AttrInput(value)
        };
        this.properties = {
            seriesName: () => key.attributes.text.value,
            index0: () => index,
            index1: () => index + 1
        };
        this.descriptionRule = [
          '$(value) $(Y Axis: unit) for $(seriesName) in $(Bar Group: name).'
        ];
    }

    foreignRepr() {
        return `${this.properties.seriesName()}:${this.properties.key()}`;
    }
}
