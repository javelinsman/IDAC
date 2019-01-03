import { ChartAccent, Annotation, ItemsTarget, RangeTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Annotations extends Tag {
  constructor(ca: ChartAccent) {
    super('annotations');
    this.children = ca.annotations.annotations
      .filter(annotation => !annotation.target_inherit)
      .map(annotation => convertToAnnotation(annotation, ca.annotations.annotations));
  }
}

function convertToAnnotation(annotation: Annotation, annotations: Annotation[]) {
  if (annotation.target.type === 'range') {  // range target (c
    if (annotation.target.range.startsWith('range')) {
      return new CoordinateRange(annotation, annotations);
    } else {
      return new CoordinateLine(annotation, annotations);
    }
  } else {
    return new Highlight(annotation);
  }
}

export class Highlight extends Tag {

  getHighlightInfo(): string[] {
    const descriptionRule = [];

    const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
    const highlight = this.annotation.components.find(d => d.type === 'highlight');
    const trendline = this.annotation.components.find(d => d.type === 'trendline');

    this.attributes.itemLabel = false;
    this.attributes.highlight = false;
    this.attributes.trendline = false;

    if (itemLabel.visible) {
      this.attributes.itemLabel = true;
      descriptionRule.push('Item labels are marked on them.');
    }
    if (highlight.visible) {
      this.attributes.highlight = true;
      this.attributes.highlightEmphasized = highlight.style.fill.value < 0;
      if (this.attributes.highlightEmphasized) {
        descriptionRule.push('They are highlighted.');
      } else {
        descriptionRule.push('They are de-emphasized.');
      }
    }
    if (trendline.visible) {
      this.attributes.trendline = true;
      descriptionRule.push('A trendline is drawn.');
    }

    return descriptionRule;

  }

  makeTargetDescription(): void {
    const targets = [];
    (this.annotation.target as ItemsTarget).items.forEach(item => {
      const series = +item.elements.slice(1) - 2;
      const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
      targets.push(`${indices.join(', ')}-th bar in ${series}-th series`);
    });
    this.attributes.target = targets.join(', and ');
  }

  constructor(protected annotation: Annotation) {
    super('highlight');
    this.makeTargetDescription();
    this.description_rule = [
      '$(target).',
      ...this.getHighlightInfo(),
    ].join(' ');
  }
}

export class CoordinateRange extends Tag {
  constructor(private annotation: Annotation, annotations: Annotation[]) {
    super('coordinateRange');

    this.attributes.axis = (annotation.target as RangeTarget).axis === 'E0' ? 'x' : 'y';
    this.makeRangeInfo();

    this.description_rule = [
      'The range from $(rangeStart) to $(rangeEnd) on $(axis) axis are marked.'
    ].join(' ');

    const relatedAnnotations = annotations.filter(_annotation =>
        _annotation.target._id === annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations
      .map(relatedAnnotation => new RelationalHighlight(relatedAnnotation));
  }

  makeRangeInfo() {
    const range = (this.annotation.target as RangeTarget).range;
    const [rangeStart, rangeEnd] = JSON.parse(
      '[' + range.slice(6, -1).split(',').slice(0, 2).join(',') + ']');
    this.attributes.rangeStart = rangeStart;
    this.attributes.rangeEnd = rangeEnd;
  }
}

export class CoordinateLine extends Tag {
  constructor(private annotation: Annotation, annotations: Annotation[]) {
    super('coordinateRange');
    this.attributes.axis = (annotation.target as RangeTarget).axis === 'E0' ? 'x' : 'y';

    this.makeRangeInfo();
    this.description_rule = [
      'The point at $(point) on $(axis) axis are marked.'
    ].join(' ');

    const relatedAnnotations = annotations.filter(_annotation =>
        _annotation.target._id === annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations
      .map(relatedAnnotation => new RelationalHighlight(relatedAnnotation));
  }

  makeRangeInfo() {
    const range = (this.annotation.target as RangeTarget).range;
    this.attributes.point = +range;
  }

}


export class RelationalHighlight extends Highlight {
  constructor(annotation: Annotation) {
    super(annotation);
  }

  makeTargetDescription() {
    const mode = this.annotation.target_inherit.mode;
    const serieses = this.annotation.target_inherit.serieses.map(series =>
      +series.slice(1) - 2);
    const lineOrRange = (this.annotation.target as RangeTarget).range.startsWith('range') ? 'the range' : 'the line';

    this.attributes.target = `Bars ${mode} ${lineOrRange} in ${serieses.join(', ')}-th serieses`;
  }
}
