import { ChartAccent, Annotation } from '../chart-accent/chart-accent';
import { Tag } from './tag';

export class Annotations extends Tag {
  constructor(ca: ChartAccent) {
    super('annotations');
    this.children = ca.annotations.annotations
      .filter(annotation => !annotation.target_inherit)
      .map(convertToAnnotation);
  }
}

function convertToAnnotation(annotation: Annotation,
  ind: number, annotations: Annotation[]) {
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
  constructor(annotation: Annotation) {
    super('highlight');

    const itemLabel = annotation.components.find(d => d.type === 'item-label');
    const highlight = annotation.components.find(d => d.type === 'highlight');
    const trendline = annotation.components.find(d => d.type === 'trendline');

    this.attributes.itemLabel = false;
    this.attributes.highlight = false;
    this.attributes.trendline = false;

    const description_rule = [];

    if (itemLabel.visible) {
      this.attributes.itemLabel = true;
      description_rule.push('Item labels are marked on them.');

    } else if (highlight.visible) {
      this.attributes.highlight = true;
      this.attributes.highlightEmphasized = highlight.style.fill.value < 0;
      if (this.attributes.highlightEmphasized) {
        description_rule.push('They are highlighted.');
      } else {
        description_rule.push('They are emphasized.');
      }
    } else if (trendline.visible) {
      this.attributes.trendline = true;
      description_rule.push('A trendline is drawn.');
    }
    this.description_rule = description_rule.join(' ');
  }
}

export class CoordinateRange extends Tag {
  constructor(annotation: Annotation, annotations: Annotation[]) {
    super('coordinateRange');
  }
}

export class CoordinateLine extends Tag {
  constructor(annotation: Annotation, annotations: Annotation[]) {
    super('coordinateLine');
  }
}
