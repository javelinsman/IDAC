import { SpecTag } from './spec-tag';
import * as ChartAccent from '../chart-accent/chart-accent';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInput, AttrInputSelect } from './attributes';
import { Highlight } from './highlight';
import { Item } from './item';
import { Bar } from './marks';
import { Tick } from './tick';
import { firstLetterUpperCase } from 'src/app/utils';

export class CoordinateLine extends SpecTag {
  active = true;
  constructor(
    public annotation: ChartAccent.Annotation,
    private annotations: ChartAccent.Annotation[],
    public _root: ChartSpec, public _parent: Annotations
  ) {
    super('Line');
    this.attributes = {
      range: new AttrInput(0),
      label: new AttrInput(''),
    };
    this.properties = {
      numChildren: () => this.children.length,
      orientation: () => this.properties.targetAxis() === 'x' ? 'vertical' : 'horizontal',
      targetAxis: () => 'x'
    };
    this.children = [] as RelationalHighlightLine[];

  }
  fromChartAccent(ca: ChartAccent.ChartAccent) {
    // rangeStart, rangeEnd
    const range = (this.annotation.target as ChartAccent.RangeTarget).range;
    this.attributes.range.value = range;
    // label
    const label = this.annotation.components.find(d => d.type === 'label');
    this.attributes.label.value = label.visible ? label.text : '';
    // targetAxis
    this.properties.targetAxis = () => (this.annotation.target as ChartAccent.RangeTarget).axis === 'E0' ? 'x' : 'y';

    // children
    const relatedAnnotations = this.annotations.filter(_annotation =>
      _annotation.target._id === this.annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations.map(relatedAnnotation => {
      const relationalHighlight = new RelationalHighlightLine(relatedAnnotation, this._root, this);
      relationalHighlight.fromChartAccent(ca);
      return relationalHighlight;
    });

  }
  afterFromChartAccent() {
    this.descriptionRule =  this.assembleDescriptionRules([
      ['A $(orientation) line passes through the point at $(range) on $(targetAxis) axis', true],
      [', labeled as "$(label)".', false, '.'],
    ]);
    this.children.forEach(child => child.afterFromChartAccent());
  }
}

export class RelationalHighlightLine extends Highlight {
  active = true;
  constructor(
    annotation: ChartAccent.Annotation,
    _root: ChartSpec, _parent: CoordinateLine
  ) {
    super(annotation, _root, _parent);
    this._tagname = 'Below or Above';
    this.attributes = {
      ...this.attributes,
      relation: new AttrInputSelect(['below', 'above'], 'below')
    };

    const mode = this.annotation.target_inherit.mode;
    this.attributes.relation.value = mode.startsWith('below') ? 'below' : 'above';
    // this._tagname = firstLetterUpperCase(this.attributes.targetRelation.value);

    this.properties = {
      ...this.properties,
      range: () => this._parent.properties.range(),
    };

  }

  fromChartAccent(ca: ChartAccent.ChartAccent) {
    super.fromChartAccent(ca);
    this.properties = {
      ...this.properties,
      targetDescription: () => this.makeTargetInfo(ca).target,
      numTargets: () => this.makeTargetInfo(ca).numTargets,
    };
  }

  getTargetLocation(): [Item, number[]][] {
    const seriesIndices = this.annotation.target_inherit.serieses.map(series => +series.slice(1) - 2);
    const locations = [];
    const axis = this._parent.properties.targetAxis();
    seriesIndices.forEach(seriesIndex => {
      const series = this._root.legend.children[seriesIndex];
      const bars = this._root.marks.children.map(bargroup => bargroup.children[seriesIndex]) as Bar[];
      const range = this.properties.range();
      const mode = this.attributes.relation.value;
      let indices: number[];
      if (axis === 'x') {
        const ticks = this._root.x.children.map((tick, i) => [tick, i]);
        const rangeIndex = ticks.find(([tick, i]: [Tick, number]) => {
          return tick.properties.text() === range;
        })[1] as number;

        indices = [];
        if (mode === 'below') {
          for (let i = 0; i < rangeIndex; i++) {
            indices.push(i);
          }
        } else {
          for (let i = rangeIndex; i < ticks.length; i++) {
            indices.push(i);
          }
        }
      } else {
        indices = bars.map((bar, i) => [bar, i]).filter(([bar, i]: [Bar, number]) => {
          const value = bar.properties.value();
          if (mode === 'below') {
            return value < range;
          } else {
            return range <= value;
          }
        }).map(([bar, i]: [Bar, number]) => i);
      }
      locations.push([series, indices]);
    });
    return locations;
  }

  afterFromChartAccent() {
    this.descriptionRule = [
    '$(relation) the line are $(numTargets) bars. $(highlight) $(itemLabel) Specifically, targets are $(targetDescription).'
    ].join(' ');
  }

}
