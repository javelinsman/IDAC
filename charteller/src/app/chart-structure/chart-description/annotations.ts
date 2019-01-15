import { ChartAccent, Annotation, ItemsTarget, RangeTarget } from '../chart-accent/chart-accent';
import { Tag } from './tag';
import { Marks } from './marks';
import * as ChartSpec from '../chart-spec/chart-spec';

export class Annotations extends Tag {
  constructor(cs: ChartSpec.ChartSpec) {
    super('annotations');
    this.children = [
      ...cs.annotations.highlights.value.map(highlight => {
        return new Highlight(highlight, cs);
      }),
      ...cs.annotations.coordinateLines.value.map(coordinateLine => {
        return new CoordinateLine(coordinateLine, cs);
      }),
      ...cs.annotations.coordinateRanges.value.map(coordinateRange => {
        return new CoordinateRange(coordinateRange, cs);
      })
    ];

    this.attributes = {
      numAnnotations: this.children.length,
    };

    this.setDescriptionRule([
      'There are $(numAnnotations) annotations.'
    ].join(' '));
  }
}

export class Highlight extends Tag {
  constructor(protected highlight: ChartSpec.Highlight, cs: ChartSpec.ChartSpec) {
    super('highlight');
    this.attributes = {
      itemLabel: highlight.itemLabel.value === 'on' ? 'Item labels are marked on them' : '',
      highlight: highlight.highlight.value === 'on' ? 'They are highlighted' : '',
      trendline: highlight.trendline.value === 'on' ? 'A trend line is drawn' : '',
      numTargets: highlight.target.value.size,
      targetLocations: Array.from(highlight.target.value).sort().map(bar => bar._foreignRepr()).join(', ')
    };
    this.setDescriptionRule([
      'The annotation on $(numTargets) bar\'s on $(targetLocations).',
      '$(highlight).',
      '$(itemLabel).',
      '$(trendline).',
    ].join(' '));
  }
}

export class CoordinateRange extends Tag {
  constructor(private coordinateRange: ChartSpec.CoordinateRange, cs: ChartSpec.ChartSpec) {
    super('coordinateRange');

    this.attributes = {
      axis: coordinateRange.target.value._foreignRepr(),
      label: coordinateRange.label.value,
      rangeStart: coordinateRange.rangeStart.value,
      rangeEnd: coordinateRange.rangeEnd.value,
      relationalHighlights: coordinateRange.relationalHighlights.value,
    };

    this.children = coordinateRange.relationalHighlights.value
      .map(relationalHighlight => new RelationalHighlightRange(relationalHighlight, cs));

    this.setDescriptionRule([
      'The range from $(rangeStart) to $(rangeEnd) on $(axis) axis are marked: $(label)'
    ].join(' '));
  }
}

export class CoordinateLine extends Tag {
  constructor(private coordinateLine: ChartSpec.CoordinateLine, cs: ChartSpec.ChartSpec) {
    super('coordinateLine');
    this.attributes = {
      axis: coordinateLine.target.value._foreignRepr(),
      label: coordinateLine.label.value,
      range: coordinateLine.range.value,
      relationalHighlights: coordinateLine.relationalHighlights.value,
    };
    this.children = coordinateLine.relationalHighlights.value
      .map(relationalHighlight => new RelationalHighlightLine(relationalHighlight, cs));

    this.setDescriptionRule([
      'The point at $(range) on $(axis) axis are marked with $(orientation) line: $(label)'
    ].join(' '));
  }
}


export class RelationalHighlightLine extends Tag {
  constructor(highlight: ChartSpec.RelationalHighlightLine, cs: ChartSpec.ChartSpec) {
    super('relationalHighlightLine');
    const targets = cs.marks.bargroups.value.map(bargroup => bargroup.bars.value).reduce((a, b) => [...a, ...b])
      .filter(bar => highlight.mode.value === 'below'
        ? bar.value.value < highlight._parent.range.value
        : bar.value.value >= highlight._parent.range.value);
    this.attributes = {
      itemLabel: highlight.itemLabel.value === 'on' ? 'Item labels are marked on them' : '',
      highlight: highlight.highlight.value === 'on' ? 'They are highlighted' : '',
      trendline: highlight.trendline.value === 'on' ? 'A trend line is drawn' : '',
      numTargets: targets.length,
      mode: highlight.mode.value,
      range: highlight._parent.range.value,
      axis: highlight._parent.target.value._foreignRepr(),
      label: highlight._parent.label.value,
      // TODO: select series
    };
    this.descriptionRule = [
      'Bars $(mode) the point $(range) of $(axis) axis.',
      'There are $(numTargets) bars selected.',
      '$(itemLabel).',
      '$(highlight).',
      '$(trendline).',
    ].join(' ');
  }
}

export class RelationalHighlightRange extends Tag {
  constructor(highlight: ChartSpec.RelationalHighlightRange, cs: ChartSpec.ChartSpec) {
    super('relationalHighlightLine');
    const targets = cs.marks.bargroups.value.map(bargroup => bargroup.bars.value).reduce((a, b) => [...a, ...b])
      .filter(bar => highlight.mode.value === 'between'
        ? (+highlight._parent.rangeStart.value <= bar.value.value && bar.value.value <= +highlight._parent.rangeEnd.value)
        : (bar.value.value < +highlight._parent.rangeStart.value || +highlight._parent.rangeEnd.value < bar.value.value));
    this.attributes = {
      itemLabel: highlight.itemLabel.value === 'on' ? 'Item labels are marked on them' : '',
      highlight: highlight.highlight.value === 'on' ? 'They are highlighted' : '',
      trendline: highlight.trendline.value === 'on' ? 'A trend line is drawn' : '',
      numTargets: targets.length,
      mode: highlight.mode.value,
      rangeStart: highlight._parent.rangeStart.value,
      rangeEnd: highlight._parent.rangeEnd.value,
      axis: highlight._parent.target.value._foreignRepr(),
      label: highlight._parent.label.value,
      // TODO: select series
    };
    this.descriptionRule = [
      'Bars $(mode) the range between $(rangeStart) and $(rangeEnd) of $(axis) axis.',
      'There are $(numTargets) bars selected.',
      '$(itemLabel).',
      '$(highlight).',
      '$(trendline).',
    ].join(' ');
  }
}
