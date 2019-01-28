import { ChartAccent } from '../chart-accent/chart-accent';
import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';
import { SpecTag } from './spec-tag';

export class ChartSpec {
    title = new Title(this);
    y = new Y(this);
    x = new X(this);
    legend = new Legend(this);
    marks = new Marks(this);
    annotations = new Annotations(this);

    _flattendTags: SpecTag[];

    fromChartAccent(ca: ChartAccent) {
        this.title.fromChartAccent(ca);
        this.y.fromChartAccent(ca);
        this.x.fromChartAccent(ca);
        this.legend.fromChartAccent(ca);
        this.marks.fromChartAccent(ca);
        this.annotations.fromChartAccent(ca);

        // assure that flattend tags will be updated
        this._flattendTags = null;
    }

    flattenedTags() {
        if (!this._flattendTags) {
            this._flattendTags = [
                ...this.title.flattenedTags(),
                ...this.y.flattenedTags(),
                ...this.x.flattenedTags(),
                ...this.legend.flattenedTags(),
                ...this.marks.flattenedTags(),
                ...this.annotations.flattenedTags()
            ];
        }
        return this._flattendTags;
    }

    findById(id: number) {
        return this.flattenedTags().find(tag => tag._id === id);
    }

}
