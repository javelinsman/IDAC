export interface IAttribute {
    [key: string]: Attribute;
}

export interface IProperty {
    [key: string]: () => string | number;
}

export class AttrInput {
    type = 'input';
    constructor(public value: string | number = '') {}
}

export type Attribute = any;
