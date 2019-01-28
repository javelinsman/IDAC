import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { Highlight } from './highlight';
import { CoordinateRange } from './coordinate-range';
import { CoordinateLine } from './coordinate-line';

type Annotation = Highlight; // | CoordinateRange | CoordinateLine;

export class Annotations extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('Annotations');
        this._parent = _root;
        this.children = [] as Annotation[];
    }
    fromChartAccent(ca: ChartAccent.ChartAccent) {
        this.children = ca.annotations.annotations
            .filter(annotation => !annotation.target_inherit)
            .map(annotation => this.convertToAnnotation(annotation, ca.annotations.annotations, ca));
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
}
