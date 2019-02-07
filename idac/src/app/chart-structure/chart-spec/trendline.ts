import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { Item } from './legend';
import { CoordinateLine } from './coordinate-line';

export class Trendline extends SpecTag {
    constructor(
        public annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations | CoordinateRange | CoordinateLine
    ) {
        super('Trendline');
        this.attributes = {
            label: new AttrInput()
        };
        this.properties = {
            targetDescription: () => '',
            numTargets: () => '',
        };
        this.descriptionRule = [
            'The annotation on $(numTargets) bar\'s on $(targetDescription).',
        ].join(' ');
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        const { target, numTargets } = this.makeTargetInfo();
        this.properties = {
            ...this.properties,
            targetDescription: () => target,
            numTargets: () => numTargets,
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
        let numTargets = 0;
        this.getTargetLocation().forEach(([series, indices]) => {
            const seriesName = series.properties.text();
            targets.push(`${indices.length === this._root.marks.children.length ?
                'all bars' : `${indices.map(i => i + 1).join(', ')}-th position`} in ${seriesName}`);
            numTargets += indices.length;
        });
        return {
            target: targets.join(', and '),
            numTargets
        };
    }

}
