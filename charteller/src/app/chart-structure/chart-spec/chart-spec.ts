export class ChartSpec {
    title = new Title(this);
    y = new Y(this);
    x = new X(this);
    legend = new Legend(this);
    marks = new Marks(this);
    annotations = new Annotations(this);

    update() {
    }

}

export class Title {
    constructor(private _root: ChartSpec) {}
    _tagname = 'Title';
    title = {
        type: 'input',
        value: ''
    };
}

export class Y  {
    constructor(private _root: ChartSpec) {}
    _tagname = 'Y';
    label = {
        type: 'input',
        value: ''
    };
    unit = {
        type: 'input',
        value: ''
    };
}
export class X {
    constructor(private _root: ChartSpec) {}
    _tagname = 'X';
    label = {
        type: 'input',
        value: ''
    };
    unit = {
        type: 'input',
        value: ''
    };
    ticks = {
        type: 'children',
        value: [] as Tick[]
    };
    addChild = {
        type: 'addFunction',
        value: () => {
        this.ticks.value.push(new Tick(this._root, this));
        this._root.update();
        },
        description: 'Add new tick'
    };
}

export class Tick {
    constructor(private _root: ChartSpec, private _parent: X) {}
    _tagname = 'Tick';
    text = {
        type: 'input',
        value: ''
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.ticks.value.splice(this._parent.ticks.value.indexOf(this), 1);
        this._root.update();
        }
    };
}

export class Legend {
    constructor(private _root: ChartSpec) {}
    _tagname = 'Legend';
    label = {
        type: 'input',
        value: ''
    };
    items = {
        type: 'children',
        value: [] as Item[]
    };
    addChild = {
        type: 'addFunction',
        value: () => {
        this.items.value.push(new Item(this._root, this));
        this._root.update();
        },
        description: 'Add new item'
    };
}

export class Item {
    constructor(private _root: ChartSpec, private _parent: Legend) {}
    _tagname = 'Item';
    text = {
        type: 'input',
        value: ''
    };
    delete = {
        type: 'deleteFunction',
        value: () => {
        this._parent.items.value.splice(this._parent.items.value.indexOf(this), 1);
        this._root.update();
        }
    };
}

export class Marks {
    constructor(private _root: ChartSpec) {}
    _tagname = 'Marks';
    bargroups = {
        type: 'children',
        value: [] as Bargroup[]
    };
}

export class Bargroup {
    constructor(private _root: ChartSpec, private _parent: Marks) {}
    _tagname = 'Bargroup';
    name = {
        type: 'foreign',
        value: null as Tick
    };
    bars =  {
        type: 'children',
        value: [] as Bar[]
    };
}

export class Bar {
    constructor(private _root: ChartSpec, private _parent: Bargroup) {}
    _tagname = 'Bar';
    key = {
        type: 'foreign',
        value: null as Item
    };
    value = {
        type: 'input',
        value: 0
    };
}

export class Annotations {
    constructor(private _root: ChartSpec) {}
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


}

export class Highlight {
    constructor(private _root: ChartSpec, private _parent: Annotations) {}
    _tagname = 'Highlight';
    target = {
        type: 'foreign',
        value: [] as Bar[]
    };
    itemLabel = {
        type: 'input',
        value: true
    };
    highlight = {
        type: 'input',
        value: true
    };
    trendline = {
        type: 'input',
        value: true
    };
    label = {
        type: 'input',
        value: ''
    };
}

export class CoordinateRange {
    constructor(private _root: ChartSpec, private _parent: Annotations) {}
    _tagname = 'CoordinateRange';
    target = {
        type: 'foreign',
        value: null as X | Y
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
}

export class CoordinateLine {
    constructor(private _root: ChartSpec, private _parent: Annotations) {}
    _tagname = 'CoordinateLine';
    target = {
        type: 'foreign',
        value: null as X | Y
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
}

export class RelationalHighlightRange {
    constructor(private _root: ChartSpec, private _parent: CoordinateRange) {}
    _tagname = 'RelationalHighlightRange';
    itemLabel = {
        type: 'input',
        value: true
    };
    highlight = {
        type: 'input',
        value: true
    };
    trendline = {
        type: 'input',
        value: true
    };
    mode = {
        type: 'input',
        value: 'between' as 'between' | 'outside'
    };
}

export class RelationalHighlightLine {
    constructor(private _root: ChartSpec, private _parent: CoordinateLine) {}
    _tagname = 'RelationalHighlightLine';
    itemLabel = {
        type: 'input',
        value: true
    };
    highlight = {
        type: 'input',
        value: true
    };
    trendline = {
        type: 'input',
        value: true
    };
    mode = {
        type: 'input',
        value: 'below' as 'below' | 'above'
    };
}
