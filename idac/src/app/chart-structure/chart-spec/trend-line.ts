import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { Item } from './legend';
import { CoordinateLine } from './coordinate-line';
import { Bar } from './marks';

export class TrendLine extends SpecTag {
    targets: Bar[] = [];
    constructor(
        public annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations | CoordinateRange | CoordinateLine
    ) {
        super('Trend Line');
        this.attributes = {
            label: new AttrInput()
        };
        this.properties = {
            targetDescription: () => '',
            numTargets: () => ''
        };
        this.descriptionRule = [
            'A trend line goes $(trend) on $(numTargets) bars, labeled as "$(label)".',
            'Specifically, the line is drawn over $(targetDescription).'
        ].join(' ');
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        const { targets, targetDescriptions, numTargets } = this.makeTargetInfo();
        this.targets = targets;
        this.properties = {
            ...this.properties,
            targetDescription: () => targetDescriptions,
            numTargets: () => numTargets,
        };
    }

    afterFromChartAccent() {
        console.log(1);
        this.properties = {
            ...this.properties,
            trend: () => {
                const values = this.targets.map(bar => +bar.properties.value());
                const diff = values.slice(-1)[0] - values[0];
                const rate = diff / (+this._root.y.properties.rangeTo() - +this._root.y.properties.rangeFrom());
                if (rate >= 0.1) {
                    return 'upward';
                } else if (rate <= -0.1) {
                    return 'downward';
                } else { return 'constant'; }
            }
        };
    }

    getTargetLocation(): [Item, number[]][] {
        const locations = [];
        (this.annotation.target as ChartAccent.ItemsTarget).items.forEach(item => {
            const seriesIndex = +item.elements.slice(1) - 2;
            const series = this._root.legend.children[seriesIndex];
            const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
            locations.push([series, indices]);
            });
        return locations;
    }

    makeTargetInfo() {
        const targets = [];
        const targetDescriptions = [];
        let numTargets = 0;
        this.getTargetLocation().forEach(([series, indices]) => {
            indices.forEach(index => targets.push(this._root.marks.children[index].children[series.properties.index0()]));
            const seriesName = series.properties.text();
            targetDescriptions.push(`${indices.length === this._root.marks.children.length ?
                'all bars' : `${indices.map(i => i + 1).join(', ')}-th position`} in ${seriesName}`);
            numTargets += indices.length;
        });
        return {
            targets,
            targetDescriptions: targetDescriptions.join(', and '),
            numTargets
        };
    }

}
