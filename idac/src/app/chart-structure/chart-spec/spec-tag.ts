import { IAttribute, IProperty } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';
import { firstLetterUpperCase } from 'src/app/utils';

interface IEditorsNote {
    text: string;
    position: 'prepend' | 'replace' | 'append';
    active: boolean;
    showInGraphView: boolean;
}

export class SpecTag {
    constructor(public _tagname: string) {
        this._id = SpecTag.idCount ++;
    }
    private static idCount = 0;
    public static _descriptionRule = '';

    public static clear() {
      SpecTag.idCount = 0;
    }

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
        showInGraphView: false
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

    peekableTags() {
        const ret: SpecTag[] = [this];
        for (let tag = this._parent; tag._tagname !== 'ChartSpec'; tag = tag._parent) {
            ret.push(tag);
        }
        this._root.children.filter(tag => !ret.includes(tag)).forEach(tag => ret.push(tag));
        return ret;
    }

    set descriptionRule(descriptionRule: string) {
        (this.constructor as any)._descriptionRule = descriptionRule;
    }

    get descriptionRule(): string {
        return (this.constructor as any)._descriptionRule;
    }

    describe(info: ChartSpec = null, tags: any[] = null,
        keyboardEvent: string = null, queryAnswer: string = null) {
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
        const args = description.match(/\$\(([^)]*)\)/g);
        if (args) {
        args.map(d => [d, d.slice(2, -1)])
            .forEach(([arg, strip]) => {
                let value = 'undefined';
                let isUndefined = true;
                if (strip.split(':').length > 1) {
                    const tagName = strip.split(':')[0].trim();
                    const keyName = strip.split(':')[1].trim();
                    const tag = this.peekableTags().find(_tag => _tag._tagname === tagName);
                    if (tag && tag.properties[keyName]) {
                      if (tag.attributes[keyName] && tag.attributes[keyName].type == 'input-select') {
                        isUndefined = false;
                      }
                      value = '' + tag.properties[keyName]();
                    }
                } else {
                    if (this.properties[strip]) {
                      if (this.attributes[strip] && this.attributes[strip].type == 'input-select') {
                        isUndefined = false;
                      }
                      value = '' + this.properties[strip]();
                    }
                }
                if (!value.length && isUndefined) { value = 'undefined'; }
                description = description.replace(arg, value);
            });
        }
        if (queryAnswer) {
            description = queryAnswer + ' ' + description;
        }
        return firstLetterUpperCase(description);
    }

    fromChartAccent(ca: ChartAccent): void {}
    afterFromChartAccent(): void {}

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
