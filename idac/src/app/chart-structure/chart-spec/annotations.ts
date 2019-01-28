import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { Highlight } from './highlight';
import { CoordinateRange, RelationalHighlightRange } from './coordinate-range';
import { CoordinateLine, RelationalHighlightLine } from './coordinate-line';

type Annotation = Highlight | CoordinateLine | CoordinateRange;
type AllAnnotation = Annotation | RelationalHighlightLine | RelationalHighlightRange;

export class Annotations extends SpecTag {
    chartAccentAnnotations: ChartAccent.Annotation[];
    constructor(public _root: ChartSpec) {
        super('Annotations');
        this._parent = _root;
        this.children = [] as Annotation[];
    }
    fromChartAccent(ca: ChartAccent.ChartAccent) {
        this.children = ca.annotations.annotations
            .filter(annotation => !annotation.target_inherit)
            .map(annotation => this.convertToAnnotation(annotation, ca.annotations.annotations, ca));
        this.chartAccentAnnotations = ca.annotations.annotations;
    }

    convertToAnnotation(annotation: ChartAccent.Annotation,
        annotations: ChartAccent.Annotation[], ca: ChartAccent.ChartAccent) {
        if (annotation.target.type === 'range') {
            if (annotation.target.range.startsWith('range')) {
                const coordinateRange = new CoordinateRange(annotation, annotations, this._root, this);
                coordinateRange.fromChartAccent(ca);
                return coordinateRange;
            } else {
                const coordinateLine = new CoordinateLine(annotation, annotations, this._root, this);
                coordinateLine.fromChartAccent(ca);
                return coordinateLine;
            }
        } else {
            const highlight = new Highlight(annotation, this._root, this);
            highlight.fromChartAccent(ca);
            return highlight;
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
