import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInput, AttrInputSelect } from './attributes';
import { Highlight } from './highlight';
import { Item } from './legend';
import { Bar } from './marks';
import { Tick } from './x';

export class CoordinateRange extends SpecTag {
    constructor(
        public annotation: ChartAccent.Annotation,
        private annotations: ChartAccent.Annotation[],
        public _root: ChartSpec, public _parent: Annotations
    ) {
        super('CoordinateRange');
        this.attributes = {
            rangeStart: new AttrInput(0),
            rangeEnd: new AttrInput(0),
            targetAxis: new AttrInputSelect(['x', 'y'], 'x'),
            label: new AttrInput(''),
        };
        this.properties = {
            numChildren: () => this.children.length,
            listOfChildren: () => this.children.map(d => d.foreignRepr()).join(', ')
        };
        this.children = [] as RelationalHighlightRange[];
        this.descriptionRule =
            'The range from $(rangeStart) to $(rangeEnd) on $(targetAxis) axis are marked: $(label)';
    }
    fromChartAccent(ca: ChartAccent.ChartAccent) {
        // rangeStart, rangeEnd
        const range = (this.annotation.target as ChartAccent.RangeTarget).range;
        const [rangeStart, rangeEnd] = JSON.parse(
            '[' + range.slice(6, -1).split(',').slice(0, 2).join(',') + ']');
        this.attributes.rangeStart.value = rangeStart;
        this.attributes.rangeEnd.value = rangeEnd;
        // label
        const label = this.annotation.components.find(d => d.type === 'label');
        this.attributes.label.value = label.visible ? label.text : '';
        // targetAxis
        this.attributes.targetAxis.value = (this.annotation.target as ChartAccent.RangeTarget).axis === 'E0' ? 'x' : 'y';

        // children
        const relatedAnnotations = this.annotations.filter(_annotation =>
            _annotation.target._id === this.annotation.target._id && _annotation.target_inherit);
        this.children = relatedAnnotations.map(relatedAnnotation => {
            const relationalHighlight = new RelationalHighlightRange(relatedAnnotation, this._root, this);
            relationalHighlight.fromChartAccent(ca);
            return relationalHighlight;
        });

    }
}

export class RelationalHighlightRange extends Highlight {
    constructor(
        annotation: ChartAccent.Annotation,
        _root: ChartSpec, _parent: CoordinateRange
    ) {
        super(annotation, _root, _parent);
        this._tagname = 'RelationalHighlightRange';
        this.attributes = {
            ...this.attributes,
            targetRelation: new AttrInputSelect(['between', 'outside'], 'between')
        };

        const mode = this.annotation.target_inherit.mode;
        this.attributes.targetRelation.value = mode.startsWith('between') ? 'between' : 'outside';

        this.properties = {
            ...this.properties,
            rangeStart: () => this._parent.properties.rangeStart(),
            rangeEnd: () => this._parent.properties.rangeEnd(),
        };
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        super.fromChartAccent(ca);

        this.properties = {
            ...this.properties,
            targetDescription: () => this.makeTargetInfo().target,
            numTargets: () => this.makeTargetInfo().numTargets,
        };
    }

    getTargetLocation(): [Item, number[]][] {
        const seriesIndices = this.annotation.target_inherit.serieses.map(series => +series.slice(1) - 2);
        const locations = [];
        const axis = this._parent.properties.targetAxis();
        seriesIndices.forEach(seriesIndex => {
            const series = this._root.legend.children[seriesIndex];
            const bars = this._root.marks.children.map(bargroup => bargroup.children[seriesIndex]) as Bar[];
            const rangeStart = this.properties.rangeStart();
            const rangeEnd = this.properties.rangeEnd();
            const mode = this.attributes.targetRelation.value;
            let indices: number[];
            if (axis === 'x') {
                const ticks = this._root.x.children.map((tick, i) => [tick, i]);
                const rangeStartIndex = ticks.find(([tick, i]: [Tick, number]) => {
                    return tick.properties.text() === rangeStart;
                })[1] as number;
                const rangeEndIndex = ticks.find(([tick, i]: [Tick, number]) => {
                    return tick.properties.text() === rangeEnd;
                })[1] as number;
                indices = [];
                if (mode === 'between') {
                    for (let i = rangeStartIndex; i <= rangeEndIndex; i++) {
                        indices.push(i);
                    }
                } else {
                    for (let i = 0; i < ticks.length; i++) {
                        if (i < rangeStartIndex || rangeEndIndex < i) {
                            indices.push(i);
                        }
                    }
                }
            } else {
                indices = bars.map((bar, i) => [bar, i]).filter(([bar, i]: [Bar, number]) => {
                    const value = bar.properties.value();
                    if (mode === 'between') {
                        return rangeStart <= value && value <= rangeEnd;
                    } else {
                        return rangeStart > value || value > rangeEnd;
                    }
                }).map(([bar, i]: [Bar, number]) => i);
            }
            locations.push([series, indices]);
        });
        return locations;
    }

}
