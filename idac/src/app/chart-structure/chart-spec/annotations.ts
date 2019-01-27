import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { AttrInputSelect, AttrInput } from './attributes';
import { Highlight } from './highlight';

type Annotation = Highlight; // | CoordinateRange | CoordinateLine;

export class Annotations extends SpecTag {
    constructor(public _root: ChartSpec) {
        super('Annotations');
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
                // return new CoordinateRange(annotation, annotations, ca);
            } else {
                // return new CoordinateLine(annotation, annotations, ca);
            }
        } else {
            const highlight = new Highlight(annotation, this._root, this);
            highlight.fromChartAccent(ca);
            return highlight;
        }
    }
}

/*
export class CoordinateRange extends SpecTag {
    constructor(public _root: ChartSpec, public _parent: Annotations) {}
    _tagname = 'CoordinateRange';
    target = {
        type: 'foreign-select',
        // candidates: [this._root.x, this._root.y],
        candidates: [this._root.y],
        value: this._root.y,
    };
    rangeStart = {
        type: 'input',
        value: 0
    };
    rangeEnd = {
        type: 'input',
        value: 0
    };
    label = {
        type: 'input',
        value: ''
    };
    relationalHighlights = {
        type: 'children',
        value: [] as RelationalHighlightRange[]
    };
    addRelationalHighlight = {
        type: 'addFunction',
        value: () => {
            this.relationalHighlights.value.push(
                new RelationalHighlightRange(this._root, this)
            );
        },
        description: 'Add new relational highlight'
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.coordinateRanges.value.splice(this._parent.coordinateRanges.value.indexOf(this), 1);
        this._root.update();
        }
    };

}

export class CoordinateLine extends SpecTag {
    constructor(public _root: ChartSpec, public _parent: Annotations) {}
    _tagname = 'CoordinateLine';
    target = {
        type: 'foreign-select',
        // candidates: [this._root.x, this._root.y],
        candidates: [this._root.y],
        value: this._root.y,
    };
    range = {
        type: 'input',
        value: 0
    };
    label = {
        type: 'input',
        value: ''
    };
    relationalHighlights = {
        type: 'children',
        value: [] as RelationalHighlightLine[]
    };
    addRelationalHighlight = {
        type: 'addFunction',
        value: () => {
            this.relationalHighlights.value.push(
                new RelationalHighlightLine(this._root, this)
            );
        },
        description: 'Add new relational highlight'
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.coordinateLines.value.splice(this._parent.coordinateLines.value.indexOf(this), 1);
        this._root.update();
        }
    };

}

export class RelationalHighlightRange {
    constructor(public _root: ChartSpec, public _parent: CoordinateRange) {}
    _tagname = 'RelationalHighlightRange';
    itemLabel = {
        type: 'input-select',
        candidates: ['on', 'off'],
        value: 'on'
    };
    highlight = {
        type: 'input-select',
        candidates: ['on', 'off'],
        value: 'on'
    };
    trendline = {
        type: 'input-select',
        // candidates: ['on', 'off'],
        candidates: ['off'],
        value: 'off'
    };
    mode = {
        type: 'input-select',
        candidates: ['between', 'outside'],
        value: 'between' as 'between' | 'outside'
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.relationalHighlights.value.splice(this._parent.relationalHighlights.value.indexOf(this), 1);
        this._root.update();
        }
    };

}

export class RelationalHighlightLine {
    constructor(public _root: ChartSpec, public _parent: CoordinateLine) {}
    _tagname = 'RelationalHighlightLine';
    itemLabel = {
        type: 'input-select',
        candidates: ['on', 'off'],
        value: 'on'
    };
    highlight = {
        type: 'input-select',
        candidates: ['on', 'off'],
        value: 'on'
    };
    trendline = {
        type: 'input-select',
        // candidates: ['on', 'off'],
        candidates: ['off'],
        value: 'off'
    };
    mode = {
        type: 'input-select',
        candidates: ['below', 'above'],
        value: 'below' as 'below' | 'above'
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.relationalHighlights.value.splice(this._parent.relationalHighlights.value.indexOf(this), 1);
        this._root.update();
        }
    };

}
*/