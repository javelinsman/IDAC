import { IAttribute, IProperty } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';
import { firstLetterUpperCase } from 'src/app/utils';
import { d3Selection } from 'src/app/chartutils';

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

  attributes: IAttribute = {};
  _properties: IProperty = {};
  _children: SpecTag[] = [];

  _id: number;
  _root: ChartSpec;
  _parent: SpecTag;

  editorsNote: IEditorsNote = {
    text: '',
    position: 'replace',
    active: false,
    showInGraphView: false
  };

  public static clear() {
    SpecTag.idCount = 0;
  }

  get children() { return this._children; }
  set children(_children) { this._children = _children; }

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
    for (let tag = this._parent; tag._parent; tag = tag._parent) {
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

  assembleDescriptionRules(rules: ([string, boolean] | [string, boolean, string])[]) {
    return rules.map(struct => {
    const rule = struct[0];
    const important = struct[1];
    if (!important && this.renderRule(rule).indexOf('undefined') >= 0) {
      return struct[2];
    } else {
      return struct[0];
    }
    }).join('');
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
    description = this.renderRule(description);

    if (queryAnswer) {
      description = queryAnswer + ' ' + description;
    }
    return firstLetterUpperCase(description);
  }

  renderRule(rule: string) {
    const args = rule.match(/\$\(([^)]*)\)/g);
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
            if (tag.attributes[keyName] && tag.attributes[keyName].type === 'input-select') {
            isUndefined = false;
            }
            value = '' + tag.properties[keyName]();
          }
        } else {
          if (this.properties[strip]) {
            if (this.attributes[strip] && this.attributes[strip].type === 'input-select') {
            isUndefined = false;
            }
            value = '' + this.properties[strip]();
          }
        }
        if (!value.length && isUndefined) { value = 'undefined'; }
        rule = rule.replace(arg, value);
      });
    }
    return rule;
  }

  fromChartAccent(ca: ChartAccent): void {}
  afterFromChartAccent(): void {}

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {}
  afterFromSpecSVG() {}

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
