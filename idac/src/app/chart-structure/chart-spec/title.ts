import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';

export class Title extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('Title');
        this._parent = _root;
        this.attributes = {
            title: new AttrInput()
        };
        this.descriptionRule =
            'This is a vertical bar chart titled "$(title)", measuring $(Y Axis: label) for $(X Axis: numChildren)  $(X Axis: label)s.';
    }
    fromChartAccent(ca: ChartAccent) {
        this.attributes = {
            title: new AttrInput(ca.chart.title.text)
        };
    }
}
