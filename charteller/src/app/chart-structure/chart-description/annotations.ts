import { ChartAccent, Annotation, ItemsTarget, RangeTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { Marks } from './marks';

export class Annotations extends Tag {
  constructor(ca: ChartAccent) {
    super('annotations');
    this.children = ca.annotations.annotations
      .filter(annotation => !annotation.target_inherit)
      .map(annotation => convertToAnnotation(annotation, ca.annotations.annotations, ca));

    this.attributes = {
      numAnnotations: this.children.length,
    };

    this.setDescriptionRule([
      'There are $(numAnnotations) annotations.'
    ].join(' '));
  }
}

function convertToAnnotation(annotation: Annotation, annotations: Annotation[], ca: ChartAccent) {
  if (annotation.target.type === 'range') {
    if (annotation.target.range.startsWith('range')) {
      return new CoordinateRange(annotation, annotations, ca);
    } else {
      return new CoordinateLine(annotation, annotations, ca);
    }
  } else {
    return new Highlight(annotation, ca);
  }
}

export class Highlight extends Tag {

  makeHighlightInfo(ca: ChartAccent): void {
    const descriptionRule = [];

    const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
    const highlight = this.annotation.components.find(d => d.type === 'highlight');
    const trendline = this.annotation.components.find(d => d.type === 'trendline');

    this.attributes.itemLabel = '';
    if (itemLabel.visible) {
      this.attributes.itemLabel = 'Item labels are marked on them.';
    }
    this.attributes.highlight = '';
    if (highlight.visible) {
      const isEmphasized = highlight.style.fill.value < 0 || highlight.style.stroke_width > 0;
      const isDeemphasized = highlight.style.fill.value > 0 && highlight.style.stroke_width <= 0;
      if (isEmphasized) {
        this.attributes.highlight = 'They are highlighted.';
      } else if (isDeemphasized) {
        this.attributes.highlight = 'They are de-emphasized.';
      }
    }
    this.attributes.trendline = '';
    if (trendline.visible) {
      this.attributes.trendline = 'A trendline is drawn.';
      /*
      const data = ca.dataset.rows.
      const increase = Math.round(10 * (data[data.length - 1] - data[0])) / 10;
      if (increase > 0) {
        this.attributes.trendline += `전체 기간 동안 ${increase}만큼 상승했습니다. `;
      } else {
        this.attributes.trendline += `전체 기간 동안 ${-increase}만큼 하락했습니다. `;
      }
      */
    }
  }

  makeTargetDescription(ca: ChartAccent): void {
    const targets = [];
    this.attributes.numTargets = 0;
    (this.annotation.target as ItemsTarget).items.forEach(item => {
      const series = +item.elements.slice(1) - 2;
      const borrowMarks = new Marks(ca);
      const seriesName = borrowMarks.children[0].children[series].attributes.seriesName;
      const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
      targets.push(`${indices.length === borrowMarks.children.length ? 'all bars' : `${indices.join(', ')}-th position`} in ${seriesName}`);
      this.attributes.numTargets += indices.length;
    });
    this.attributes.targetLocations = targets.join(', and ');
  }

  constructor(protected annotation: Annotation, ca: ChartAccent) {
    super('highlight');
    this.makeTargetDescription(ca);
    this.makeHighlightInfo(ca);
    this.setDescriptionRule([
      'The annotation on $(numTargets) bar\'s on $(targetLocations).',
      '$(highlight)',
      '$(itemLabel)',
      '$(trendline)',
    ].join(' '));
  }
}

export class CoordinateRange extends Tag {
  constructor(private annotation: Annotation, annotations: Annotation[], ca: ChartAccent) {
    super('coordinateRange');

    this.attributes.axis = (annotation.target as RangeTarget).axis === 'E0' ? 'x' : 'y';
    this.makeRangeInfo();

    const label = annotation.components.find(d => d.type === 'label');
    this.attributes.label = label.visible ? label.text : '';

    this.setDescriptionRule([
      'The range from $(rangeStart) to $(rangeEnd) on $(axis) axis are marked: $(label)'
    ].join(' '));

    const relatedAnnotations = annotations.filter(_annotation =>
        _annotation.target._id === annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations
      .map(relatedAnnotation => new RelationalHighlight(relatedAnnotation, ca));
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
  constructor(private annotation: Annotation, annotations: Annotation[], ca: ChartAccent) {
    super('coordinateRange');
    this.attributes.axis = (annotation.target as RangeTarget).axis === 'E0' ? 'x' : 'y';
    this.attributes.orientation = this.attributes.axis === 'x' ? 'vertical' : 'horizontal';

    const label = annotation.components.find(d => d.type === 'label');
    this.attributes.label = label.visible ? label.text : '';

    this.makeRangeInfo();
    this.setDescriptionRule([
      'The point at $(point) on $(axis) axis are marked with $(orientation) line: $(label)'
    ].join(' '));

    const relatedAnnotations = annotations.filter(_annotation =>
        _annotation.target._id === annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations
      .map(relatedAnnotation => new RelationalHighlight(relatedAnnotation, ca));
  }

  makeRangeInfo() {
    const range = (this.annotation.target as RangeTarget).range;
    this.attributes.point = +range;
  }

}


export class RelationalHighlight extends Highlight {
  constructor(annotation: Annotation, ca: ChartAccent) {
    super(annotation, ca);
    this.tagname = 'relationalHighlight';
  }

  makeTargetDescription(ca: ChartAccent) {
    const mode = this.annotation.target_inherit.mode;
    const serieses = this.annotation.target_inherit.serieses.map(series =>
      +series.slice(1) - 2);
    const lineOrRange = (this.annotation.target as RangeTarget).range.startsWith('range') ? 'the range' : 'the line';

    this.attributes.numTargets = 0;
    this.attributes.targetLocations = `Bars ${mode} ${lineOrRange} in ${serieses.join(', ')}-th serieses`;
  }
}
