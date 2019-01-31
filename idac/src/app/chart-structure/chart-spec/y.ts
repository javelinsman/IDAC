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
            rangeMin: new AttrInput(),
            rangeMax: new AttrInput(),
        };
        this.descriptionRule = [
            'Y axis with label name $(label).',
            'The unit of measurement is $(unit).',
            'The range is from $(rangeMin) to $(rangeMax).',
            ].join(' ');
    }
    fromChartAccent(ca: ChartAccent) {
        this.attributes = {
            label: new AttrInput(ca.chart.yLabel.text.split('(')[0].trim()),
            unit: new AttrInput(ca.chart.yLabel.text.split('(')
                .slice(1).join('(').slice(0, -1).trim()),
            rangeMax: new AttrInput(ca.chart.yScale.max),
            rangeMin: new AttrInput(ca.chart.yScale.min)
        };
    }
    _foreignRepr() {
        return this._tagname;
    }
}
