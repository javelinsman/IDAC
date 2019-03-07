import * as d3 from 'd3';
import { d3AsSelectionArray } from './utils';

export function translate(x: number, y: number) {
    return `translate(${x}, ${y})`;
}

export type d3Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export function caSpecDistinctClasses(selection: d3.Selection<any, any, any, any>, className: string, flat=false) {
  let elems;
  if (flat) {
    elems = d3AsSelectionArray(selection);
  } else {
    elems = d3AsSelectionArray(selection.selectAll(`.${className}`));
  }
  console.log(elems);
  return Array.from(new Set(
    elems.map(elem => elem.attr('class').split(' ')
      .filter(a => a.startsWith(`${className}-`)))
      .reduce((a, b) => [...a, ...b], [])
    ));
}
