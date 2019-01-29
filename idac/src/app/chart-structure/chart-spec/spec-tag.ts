import { IAttribute, IProperty } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';

interface IEditorsNote {
    text: string;
    position: 'prepend' | 'replace' | 'append';
    active: boolean;
}

export class SpecTag {
    constructor(public _tagname: string) {
        this._id = SpecTag.idCount ++;
    }
    private static idCount = 0;
    public static _descriptionRule = '';

    attributes: IAttribute = {};
    _properties: IProperty = {};
    children: SpecTag[];

    _id: number;
    _root: ChartSpec;
    _parent: SpecTag;

    editorsNote: IEditorsNote = {
        text: '',
        position: 'replace',
        active: false,
    };

    set properties(properties: IProperty) {
        this._properties = properties;
    }

    get properties(): IProperty {
        this.propagateAttributes();
        return this._properties;
    }

    propagateAttributes() {
        Object.entries(this.attributes).forEach(([key, value]) => {
            if (!(key in this._properties)) {
                this._properties[key] = () => value.value;
            }
        });
    }

    set descriptionRule(descriptionRule: string) {
        (this.constructor as any)._descriptionRule = descriptionRule;
    }

    get descriptionRule(): string {
        return (this.constructor as any)._descriptionRule;
    }

    describe(info: ChartSpec = null, tags: any[] = null, keyboardEvent: string = null, queryAnswer: string = null) {
        let description = this.descriptionRule;
        if (this.editorsNote.active) {
            const text = this.editorsNote.text;
            const position = this.editorsNote.position;
            if (position === 'append') {
                description = `${description} ${text}`;
            } else if (position === 'replace') {
                description = text;
            } else if (position === 'prepend') {
                description = `${text} ${description}`;
            }
        }
        if (queryAnswer) {
            description = queryAnswer + ' ' + description;
            console.log(description);
        }
        const args = description.match(/\$\(([^)]*)\)/g);
        if (args) {
        args.map(d => [d, d.slice(2, -1)])
            .forEach(([arg, strip]) =>
            description = description.replace(arg, '' +
                (this.properties[strip] ? this.properties[strip]() : 'undefined')
            ));
        }
        return description;
    }

    fromChartAccent(ca: ChartAccent): void {}

    foreignRepr(): string {
        return this._tagname;
    }

    flattenedTags(): SpecTag[] {
        let ret: SpecTag[] = [this];
        if (this.children && this.children.length) {
            this.children.forEach(tag => ret = [...ret, ...tag.flattenedTags()]);
        }
        return ret;
    }
}
