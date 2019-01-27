import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { AttrInputSelect, AttrInput } from './attributes';

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

export class Highlight extends SpecTag {
    constructor(
        private annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations
    ) {
        super('Highlight');
        this.attributes = {
            itemLabel: new AttrInputSelect(['on', 'off'], 'off'),
            highlight: new AttrInputSelect(['emphasize', 'de-emphasize', 'off'], 'off'),
            trendline: new AttrInputSelect(['on', 'off'], 'off'),
            label: new AttrInput()
        };
        this.properties = {
            targetDescription: () => '',
            numTargets: () => '',
            itemLabel: () => '',
            trendline: () => '',
            highlight: () => ''
        };
        this.descriptionRule = [
            'The annotation on $(numTargets) bar\'s on $(targetDescription).',
            '$(highlight)',
            '$(itemLabel)',
            '$(trendline)',
          ].join(' ');
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
        this.attributes.itemLabel.value = itemLabel.visible ? 'on' : 'off';
        const trendline = this.annotation.components.find(d => d.type === 'trendline');
        this.attributes.trendline.value = trendline.visible ? 'on' : 'off';
        const highlight = this.annotation.components.find(d => d.type === 'highlight');
        if (highlight.visible) {
            if (highlight.style.fill.value < 0 || highlight.style.stroke_width > 0) {
                this.attributes.highlight.value = 'emphasize';
            } else if (highlight.style.fill.value > 0 && highlight.style.stroke_width <= 0) {
                this.attributes.highlight.value = 'de-emphasize';
            } else {
                this.attributes.highlight.value = 'off';
            }
        } else {
            this.attributes.highlight.value = 'off';
        }
        const { target, numTargets } = this.makeTargetInfo(ca);
        this.properties = {
            targetDescription: () => target,
            numTargets: () => numTargets,
            itemLabel: () => this.attributes.itemLabel.value === 'on'
                ? 'Item labels are marked on them.' : '',
            trendline: () => this.attributes.trendline.value === 'on'
                ? 'A trendline is drawn.' : '',
            highlight: () => {
                if (this.attributes.highlight.value === 'emphasize') {
                    return 'They are highlighted.';
                } else if (this.attributes.highlight.value === 'de-emphasize') {
                    return 'They are de-emphasized.';
                } else {
                    return '';
                }
            }
        };
    }

    makeTargetInfo(ca: ChartAccent.ChartAccent) {
        const targets = [];
        let numTargets = 0;
        (this.annotation.target as ChartAccent.ItemsTarget).items.forEach(item => {
          const series = +item.elements.slice(1) - 2;
          const borrowMarks = this._root.marks;
          const seriesName = borrowMarks.children[0].children[series].properties.seriesName();
          const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
          targets.push(`${indices.length === borrowMarks.children.length ?
            'all bars' : `${indices.join(', ')}-th position`} in ${seriesName}`);
          numTargets += indices.length;
        });
        return {
            target: targets.join(', and '),
            numTargets
        };
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