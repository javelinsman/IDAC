import { ChartSpec } from './chart-spec';
import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { Highlight } from './highlight';
import { CoordinateRange, RelationalHighlightRange } from './coordinate-range';
import { CoordinateLine, RelationalHighlightLine } from './coordinate-line';
import { TrendLine } from './trend-line';
import { Note } from './note';

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
      numNotes: () => this.children.filter(tag => tag._tagname === 'Note').length,
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
    this.descriptionRule = 'There are total of $(numChildren) annotations, consisting of '
      + descriptionRules.slice(0, -1).join(', ') + ' and ' + descriptionRules.slice(-1)[0] + '.';
    } else if (this.properties.numChildren() == 1) {
    this.descriptionRule = 'There is ' + descriptionRules[0] + '.';
    } else {
    this.descriptionRule = 'There are no annotations.';
    }

    /*
    const makeNote = (content) => {
      const note = new Note(null, this._root, this);
      note.attributes.label.value = content;
      return note;
    };

    if (this._root.chartType === 'line-chart') {
      this._children[0].attributes.label.value = '8/1/18: Apple is 1st in U.S. company to officially hit $1 trillion market cap.';
      this._children[1].attributes.label.value = '11/30: Apple loses spot as most valuable company to Microsoft, but only for the day.';
      this._children[2].attributes.label.value = '1/3: Apple plunges to No.4 behind Alphabet, after reporting a revenue warning.';
      this._children[3].attributes.label.value = 'December: Microsoft cements its spot at No. 1';
      this._children[0].descriptionRule = '$(label)';
    } else {
      this._children = [
        this._children[1],
        this._children[2],
        this._children[3]
      ];
      this._children[0].attributes.label.value = 'The higher fertility rate, the lower life expectancy.';
      this._children[0].descriptionRule = 'A trend line goes $(trend) on $(numTargets) points. A caption reads: "$(label)"';
      this._children[1].attributes.label.value = 'Sub-Saharan Africa region has a high fertility rate in most countries.';
      this._children[2].attributes.label.value = 'Top 3 countries with the highest GDP';
      this._children[2].descriptionRule = '$(targetDescription) are highlighted. A caption reads: "$(label)"';
      this._children[2].editorsNote = {
        text: 'The top 3 countries with the highest GDP are China, US, and Japan. All of them shows lower fertility rate and higher life expectancy.',
        position: 'replace',
        active: true,
        showInGraphView: false
      };
      this._root.marks.children[0].descriptionRule = 'There are $(numPoints) countries in $(name). Each point indicates country, fertility rate, and life expectancy, respectively.';
      this._root.marks.children[0].children[0].descriptionRule = '$(country), $(x) babies, $(y) years.';
    }
    */
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

  prependChild(childTag: SpecTag) {
    this._children = [
      childTag,
      ...this._children
    ];
  }

  addAnnotation(tagname: string) {
    let child = null;
    if (tagname === 'Note') {
      child = new Note(null, this._root, this);
    } else if (tagname === 'Highlight') {
      child = new Highlight(null, this._root, this);
    }

    if (child) { this.prependChild(child); }
  }

  deleteAnnotation(tag: SpecTag) {
    this._children.splice(this._children.indexOf(tag), 1);
  }

  moveAnnotation(sourceIndex: number, targetIndex: number) {
    const item = this._children[sourceIndex];
    this._children.splice(this._children.indexOf(item), 1);
    if (sourceIndex < targetIndex) { targetIndex--; }
    this._children.splice(targetIndex, 0, item);
  }

  mergeAnnotations(sourceIndex: number, targetIndex: number) {
    console.log('mergeAnnotations', sourceIndex, targetIndex);
  }

}
