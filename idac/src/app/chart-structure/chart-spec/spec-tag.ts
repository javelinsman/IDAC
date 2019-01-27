import { IAttribute, IProperty } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';

export class SpecTag {
    constructor(protected _tagname: string) { }
    public static _descriptionRule = '';

    attributes: IAttribute = {};
    _properties: IProperty = {};

    set properties(properties: IProperty) {
        this._properties = properties;
    }

    get properties(): IProperty {
        this.propagateAttributes();
        return this._properties;
    }

    propagateAttributes() {
        Object.entries(this.attributes).forEach(([key, value]) => {
            this._properties[key] = () => value.value;
        });
    }

    set descriptionRule(descriptionRule: string) {
        (this.constructor as any)._descriptionRule = descriptionRule;
    }

    get descriptionRule(): string {
        return (this.constructor as any)._descriptionRule;
    }

    describe(info: ChartSpec, tags: any[], keyboardEvent: string, queryAnswer: string = null) {
        let description = this.descriptionRule;
        if (queryAnswer) {
            description = queryAnswer + ' ' + description;
            console.log(description);
        }
        const args = description.match(/\$\(([^)]*)\)/g);
        if (args) {
        args.map(d => [d, d.slice(2, -1)])
            .forEach(([arg, strip]) =>
            description = description.replace(arg,
                this.properties[strip] ? this.properties[strip]() : 'undefined'
            ));
        }
        return description;
    }

    fromChartAccent(ca: ChartAccent): void {}
}
