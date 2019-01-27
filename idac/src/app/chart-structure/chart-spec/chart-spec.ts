import { ChartAccent } from '../chart-accent/chart-accent';
import { Title } from './title';
import { Y } from './y';
import { X, Tick } from './x';
import { Legend, Item } from './legend';
import { Marks, Bar } from './marks';

export class ChartSpec {
    title = new Title(this);
    y = new Y(this);
    x = new X(this);
    legend = new Legend(this);
    marks = new Marks(this);
    annotations = new Annotations(this);

    fromChartAccent(ca: ChartAccent) {
        this.title.fromChartAccent(ca);
        this.y.fromChartAccent(ca);
        this.x.fromChartAccent(ca);
        this.legend.fromChartAccent(ca);
        this.marks.fromChartAccent(ca);
    }

    update() {
    /*
        const ticks = this.x.ticks.value;
        const items = this.legend.items.value;
        const prev_values = {};
        this.marks.bargroups.value.forEach(bargroup => {
            const tick = bargroup.name.value.text.value;
            prev_values[tick] = {};
            bargroup.bars.value.forEach(bar => {
                const item = bar.key.value.text.value;
                prev_values[tick][item] = bar.value.value;
            });
        });
        this.marks.bargroups = {
            type: 'children',
            value: ticks.map(tick => {
                const bargroup = new Bargroup(this, this.marks);
                bargroup.name.value = tick;
                bargroup.bars = {
                    type: 'children',
                    value: items.map(item => {
                        const bar = new Bar(this, bargroup);
                        bar.key.value = item;
                        if (prev_values[tick.text.value] && prev_values[tick.text.value][item.text.value]) {
                            bar.value.value = prev_values[tick.text.value][item.text.value];
                        } else {
                            bar.value.value = 0;
                        }
                        return bar;
                    })
                };
                return bargroup;
            })
        };
    */
    }

}

export class Annotations {
    constructor(public _root: ChartSpec) {}
    _tagname = 'Annotations';
    highlights = {
        type: 'children',
        value: [] as Highlight[]
    };
    coordinateRanges = {
        type: 'children',
        value: [] as CoordinateRange[]
    };
    coordinateLines = {
        type: 'children',
        value: [] as CoordinateLine[]
    };

    addHighlights = {
        type: 'addFunction',
        value: () => {
            this.highlights.value.push(
                new Highlight(this._root, this)
            );
        },
        description: 'Add new highlight'
    };
    addCoordinateLine = {
        type: 'addFunction',
        value: () => {
            this.coordinateLines.value.push(
                new CoordinateLine(this._root, this)
            );
        },
        description: 'Add new coordinate line'
    };

    addCoordinateRange = {
        type: 'addFunction',
        value: () => {
            this.coordinateRanges.value.push(
                new CoordinateRange(this._root, this)
            );
        },
        description: 'Add new coordinate range'
    };

    clear() {
        this.highlights.value = [];
        this.coordinateLines.value = [];
        this.coordinateRanges.value = [];
    }

}

export class Highlight {
    constructor(public _root: ChartSpec, public _parent: Annotations) {}
    /*
    _tagname = 'Highlight';
    target = {
        type: 'foreign-multiselect',
        candidates: this._root.marks.children.value
            .map(bargroup => bargroup.bars.value)
            .reduce((a, b) => [...a, ...b], []),
        value: new Set() as Set<Bar>
    };
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
    label = {
        type: 'input',
        value: ''
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.highlights.value.splice(this._parent.highlights.value.indexOf(this), 1);
        this._root.update();
        }
    };
    */
}

export class CoordinateRange {
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

export class CoordinateLine {
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
