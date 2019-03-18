import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { Highlight } from './highlight';
import { CoordinateRange, RelationalHighlightRange } from './coordinate-range';
import { CoordinateLine, RelationalHighlightLine } from './coordinate-line';
import { TrendLine } from './trend-line';

type Annotation = Highlight | TrendLine | CoordinateLine | CoordinateRange;
type AllAnnotation = Annotation | RelationalHighlightLine | RelationalHighlightRange;

export class Annotations extends SpecTag {
  chartAccentAnnotations: ChartAccent.Annotation[];
  _children;
  constructor(public _root: ChartSpec) {
    super('Annotations');
    this._parent = _root;
    this._children = [] as Annotation[];
    this.properties = {
      numChildren: () => this.children.length,
      numHighlights: () => this.children.filter(tag => tag._tagname === 'Highlight').length,
      numTrendlines: () => this.children.filter(tag => tag._tagname === 'Trend Line').length,
      numLines: () => this.children.filter(tag => tag._tagname === 'Line').length,
      numRanges: () => this.children.filter(tag => tag._tagname === 'Range').length,
    };

  }
  fromChartAccent(ca: ChartAccent.ChartAccent) {
    this._children = [];
    ca.annotations.annotations
      .filter(annotation => !annotation.target_inherit)
      .forEach(annotation => {
        this.convertToAnnotations(annotation, ca.annotations.annotations, ca)
          .forEach(a => this._children.push(a));
      });
    this.chartAccentAnnotations = ca.annotations.annotations;
  }

  get children() {
    return this._children.filter(child => child.active !== false);
  }

  afterFromChartAccent() {
    const descriptionRules = [
    ];
    if (this.properties.numHighlights()) { descriptionRules.push(
    '$(numHighlights) highlight' + (this.properties.numHighlights() > 1 ? 's' : '')
    ); }
    if (this.properties.numTrendlines()) { descriptionRules.push(
    '$(numTrendlines) trend line' + (this.properties.numTrendlines() > 1 ? 's' : '')
    ); }
    if (this.properties.numLines()) { descriptionRules.push(
    '$(numLines) line' + (this.properties.numLines() > 1 ? 's' : '')
    ); }
    if (this.properties.numRanges()) { descriptionRules.push(
    '$(numRanges) range' + (this.properties.numRanges() > 1 ? 's' : '')
    ); }

    if (this.properties.numChildren() > 1) {
    this.descriptionRule = 'There are total of $(numChildren) annotations, which consists of '
      + descriptionRules.slice(0, -1).join(', ') + ' and ' + descriptionRules.slice(-1)[0] + '.';
    } else if (this.properties.numChildren() == 1) {
    this.descriptionRule = 'There is ' + descriptionRules[0] + '.';
    } else {
    this.descriptionRule = 'There are no annotations.';
    }
  }

  convertToAnnotations(annotation: ChartAccent.Annotation,
    annotations: ChartAccent.Annotation[], ca: ChartAccent.ChartAccent): Annotation[] {
    if (annotation.target.type === 'range') {
      if (annotation.target.range.startsWith('range')) {
        const coordinateRange = new CoordinateRange(annotation, annotations, this._root, this);
        coordinateRange.fromChartAccent(ca);
        coordinateRange.afterFromChartAccent();
        return [coordinateRange];
      } else {
        const coordinateLine = new CoordinateLine(annotation, annotations, this._root, this);
        coordinateLine.fromChartAccent(ca);
        coordinateLine.afterFromChartAccent();
        return [coordinateLine];
      }
    } else {
      const ret = [];
      const _itemLabel = annotation.components.find(d => d.type === 'item-label');
      const _highlight = annotation.components.find(d => d.type === 'highlight');
      const _bubbleset = annotation.components.find(d => d.type === 'bubbleset');
      if ((_itemLabel && _itemLabel.visible) || (_highlight && _highlight.visible) || (_bubbleset && _bubbleset.visible)) {
        const highlight = new Highlight(annotation, this._root, this);
        highlight.fromChartAccent(ca);
        highlight.afterFromChartAccent();
        ret.push(highlight);
      }
      const _trendline = annotation.components.find(d => d.type === 'trendline');
      if (_trendline && _trendline.visible) {
        const trendLine = new TrendLine(annotation, this._root, this);
        trendLine.fromChartAccent(ca);
        trendLine.afterFromChartAccent();
        ret.push(trendLine);
      }
      return ret;
    }
  }

  findByAnnotation(annotation: ChartAccent.Annotation) {
    return this.flattenedTags().slice(1).find((_annotation: AllAnnotation) =>
      _annotation.annotation === annotation);
  }

  annotationInChartAccent(index: number) {
    return this.chartAccentAnnotations[index];
  }
}
