export interface IAttribute {
    [key: string]: Attribute;
}

export interface IProperty {
    [key: string]: () => string;
}

export class AttrInput {
    type = 'input';
    constructor(public value: string = '') {}
}

export type Attribute = any;
