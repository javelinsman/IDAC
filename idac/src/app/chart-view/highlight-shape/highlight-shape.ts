import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as d3 from 'd3';
import { d3AsSelectionArray, makeAbsoluteContext, mergeBoundingBoxes } from 'src/app/utils';
import { translate } from 'src/app/chartutils';

function createSVGElement(tagname: string) {
  const namespace = d3.namespace('svg') as d3.NamespaceLocalObject;
  return document.createElementNS(namespace.space, tagname);
}

export class HighlightShape {
  constructor(
      public tag: SpecTag,
      public associatedElement: d3.Selection<any, any, any, any>,
      public svg: d3.Selection<SVGSVGElement, any, any, any>
  ) { }

  static getShape (
      tag: SpecTag,
      associatedElement: d3.Selection<any, any, any, any>,
      svg: d3.Selection<SVGSVGElement, any, any, any>
    ) {
      const _class = getHighlightShapeClass(tag._tagname);
      return new _class(tag, associatedElement, svg);
  }

  getMergedBoundingBox(selection: d3.Selection<any, any, any, any>) {
    const boundingBoxes = [
      ...selection.nodes().map(d => d3.select(d)),
      ...d3AsSelectionArray(selection.selectAll('*'))
    ].map(d => {
      const elem = d.node();
      const bbox = elem.getBBox();
      const convert = makeAbsoluteContext(elem, this.svg.node());
      return {
        ...convert(bbox.x, bbox.y),
        width: bbox.width,
        height: bbox.height
      };
    });
    const mergedBox = mergeBoundingBoxes(boundingBoxes);
    mergedBox.width = Math.max(mergedBox.width, 5);
    mergedBox.height = Math.max(mergedBox.height, 5);
    return mergedBox;
  }

  makeRectFromBoundingBox(box: any) {
    const a = d3.select(createSVGElement('rect'));
    return d3.select(createSVGElement('rect'))
      .attr('transform', translate(box.x, box.y))
      .attr('width', box.width).attr('height', box.height);
  }

  elemMark() {
    const boundingBox = this.getMergedBoundingBox(this.associatedElement);
    return this.makeRectFromBoundingBox(boundingBox).node();
  }

  bookmark() {
    const boundingBox = this.getMergedBoundingBox(this.associatedElement);
    return this.makeRectFromBoundingBox(boundingBox).node();
  }

}

class Title extends HighlightShape { }
class Y extends HighlightShape { }
class X extends HighlightShape { }
class Tick extends HighlightShape { }
class Legend extends HighlightShape {

  makeShell({ x, y, width, height }: { [k: string]: number }) {
    const w = width, h = height, d = 15;
    const path = `M0 0 h${w} v${h} h${-w}z`
      + `M${-d} ${-d} v${h + 2 * d} h${w + 2 * d} v${-h - 2 * d}z`;
    return d3.select(createSVGElement('path'))
      .attr('d', path)
      .attr('fill-rule', 'evenodd')
      .attr('transform', translate(x, y));
  }

  elemMark() {
    const boundingBox = this.getMergedBoundingBox(this.associatedElement);
    return this.makeShell(boundingBox).node();

  }
}
class Item extends HighlightShape { }
class Marks extends HighlightShape { }
class BarGroup extends HighlightShape { }
class Bar extends HighlightShape { }
class Annotations extends HighlightShape { }
class Highlight extends HighlightShape { }
class Line extends HighlightShape { }
class Range extends HighlightShape { }
class RelationalHighlightLine extends HighlightShape { }
class RelationalHighlightRange extends HighlightShape { }

function getHighlightShapeClass(tagname: string) {
  switch (tagname) {
    case 'Title':
      return Title;
    case 'Y':
      return Y;
    case 'X':
      return X;
    case 'Tick':
      return Tick;
    case 'Legend':
      return Legend;
    case 'Item':
      return Item;
    case 'Marks':
      return Marks;
    case 'Bar Group':
      return BarGroup;
    case 'Bar':
      return Bar;
    case 'Annotations':
      return Annotations;
    case 'Highlight':
      return Highlight;
    case 'Line':
      return Line;
    case 'Range':
      return Range;
    case 'RelationalHighlightLine':
      return RelationalHighlightLine;
    case 'RelationalHighlightRange':
      return RelationalHighlightRange;
    default:
      return HighlightShape;
  }
}
