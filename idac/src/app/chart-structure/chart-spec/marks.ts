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

    }
    fromChartAccent(ca: ChartAccent) {
        this.children = ca.dataset.rows.map((row, index) => new Bargroup(row, index, this._root, this));
    }
    afterFromChartAccent() {
      this.descriptionRule = this.assembleDescriptionRules([
        ['There are $(numBarGroups) bar groups', true],
        [', which correspond to each $(X Axis: label).', false, '.'],
        [' And each bar group contains $(numBars) bars', true],
        [', which correspond to each series of $(Legend: label).', false, '.'],
      ]);
      this.children.forEach(child => child.afterFromChartAccent());
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

    }
    afterFromChartAccent() {
      this.descriptionRule = this.assembleDescriptionRules([
        ['A bar group in $(name).', true],
        [' It contains $(numBars) bars.', true],
        [' The sum of all bars inside is $(sumOfBarValues)', true],
        [' $(Y Axis: unit)', false, ''],
        [', indicating $(Y Axis: label).', false, '.']
      ]);
      this.children.forEach(child => child.afterFromChartAccent());
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
    }

    foreignRepr() {
        return `${this.properties.seriesName()}:${this.properties.key()}`;
    }

    afterFromChartAccent() {
      this.descriptionRule = this.assembleDescriptionRules([
        ['$(value)', true],
        [' $(Y Axis: unit)', false, ''],
        [' for $(seriesName) in $(Bar Group: name).', true],
      ]);
    }
}
