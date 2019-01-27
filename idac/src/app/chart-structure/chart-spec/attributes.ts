import { SpecTag } from './spec-tag';

type Value = string | number;

export interface IAttribute {
    [key: string]: Attribute;
}

export interface IProperty {
    [key: string]: () => Value;
}

export class AttrInput {
    type = 'input';
    constructor(public value: Value = '') {}
}

export class AttrInputSelect {
    type =  'input-select';
    constructor(public candidates: Value[], public value: Value) {}
}

export type Attribute = any;
