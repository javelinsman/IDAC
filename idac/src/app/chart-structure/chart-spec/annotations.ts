import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { Highlight } from './highlight';
import { CoordinateRange, RelationalHighlightRange } from './coordinate-range';
import { CoordinateLine, RelationalHighlightLine } from './coordinate-line';
import { Trendline } from './trendline';

type Annotation = Highlight | Trendline | CoordinateLine | CoordinateRange;
type AllAnnotation = Annotation | RelationalHighlightLine | RelationalHighlightRange;

export class Annotations extends SpecTag {
    chartAccentAnnotations: ChartAccent.Annotation[];
    constructor(public _root: ChartSpec) {
        super('Annotations');
        this._parent = _root;
        this.children = [] as Annotation[];
        this.properties = {
            numChildren: () => this.children.length,
            numHighlights: () => this.children.filter(tag => tag._tagname === 'Highlight').length,
            numTrendlines: () => this.children.filter(tag => tag._tagname === 'Trendline').length,
            numLines: () => this.children.filter(tag => tag._tagname === 'Line').length,
            numRanges: () => this.children.filter(tag => tag._tagname === 'Range').length,
        };
    }
    fromChartAccent(ca: ChartAccent.ChartAccent) {
        this.children = [];
        ca.annotations.annotations
            .filter(annotation => !annotation.target_inherit)
            .forEach(annotation => {
                this.convertToAnnotations(annotation, ca.annotations.annotations, ca)
                    .forEach(a => this.children.push(a));
            });
        this.chartAccentAnnotations = ca.annotations.annotations;
    }

    convertToAnnotations(annotation: ChartAccent.Annotation,
        annotations: ChartAccent.Annotation[], ca: ChartAccent.ChartAccent): Annotation[] {
        if (annotation.target.type === 'range') {
            if (annotation.target.range.startsWith('range')) {
                const coordinateRange = new CoordinateRange(annotation, annotations, this._root, this);
                coordinateRange.fromChartAccent(ca);
                return [coordinateRange];
            } else {
                const coordinateLine = new CoordinateLine(annotation, annotations, this._root, this);
                coordinateLine.fromChartAccent(ca);
                return [coordinateLine];
            }
        } else {
            const ret = [];
            const _itemLabel = annotation.components.find(d => d.type === 'item-label');
            const _highlight = annotation.components.find(d => d.type === 'highlight');
            if (_itemLabel.visible || _highlight.visible) {
                const highlight = new Highlight(annotation, this._root, this);
                highlight.fromChartAccent(ca);
                ret.push(highlight);
            }
            const _trendline = annotation.components.find(d => d.type === 'trendline');
            if (_trendline.visible) {
                const trendline = new Trendline(annotation, this._root, this);
                trendline.fromChartAccent(ca);
                ret.push(trendline);
            }
            return ret;
        }
    }

    findByAnnotation(annotation: ChartAccent.Annotation) {
        return this.flattenedTags().slice(1).find((_annotation: AllAnnotation) =>
            _annotation.annotation === annotation);
    }

    annotationInChartAccent(index: number) {
        return this.chartAccentAnnotations[index];
    }
}
