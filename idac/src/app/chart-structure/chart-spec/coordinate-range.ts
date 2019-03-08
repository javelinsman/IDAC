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

export class CoordinateRange extends SpecTag {
  constructor(
    public annotation: ChartAccent.Annotation,
    private annotations: ChartAccent.Annotation[],
    public _root: ChartSpec, public _parent: Annotations
  ) {
    super('Range');
    this.attributes = {
      rangeFrom: new AttrInput(0),
      rangeTo: new AttrInput(0),
      targetAxis: new AttrInputSelect(['x', 'y'], 'x'),
      label: new AttrInput(''),
    };
    this.properties = {
      numChildren: () => this.children.length,
    };
    this.children = [] as RelationalHighlightRange[];
  }
  fromChartAccent(ca: ChartAccent.ChartAccent) {
    // rangeFrom, rangeTo
    const range = (this.annotation.target as ChartAccent.RangeTarget).range;
    const [rangeFrom, rangeTo] = JSON.parse(
      '[' + range.slice(6, -1).split(',').slice(0, 2).join(',') + ']');
    this.attributes.rangeFrom.value = rangeFrom;
    this.attributes.rangeTo.value = rangeTo;
    // label
    const label = this.annotation.components.find(d => d.type === 'label');
    this.attributes.label.value = label.visible ? label.text : '';
    // targetAxis
    this.attributes.targetAxis.value = (this.annotation.target as ChartAccent.RangeTarget).axis === 'E0' ? 'x' : 'y';

    // children
    const relatedAnnotations = this.annotations.filter(_annotation =>
      _annotation.target._id === this.annotation.target._id && _annotation.target_inherit);
    this.children = relatedAnnotations.map(relatedAnnotation => {
      const relationalHighlight = new RelationalHighlightRange(relatedAnnotation, this._root, this);
      relationalHighlight.fromChartAccent(ca);
      return relationalHighlight;
    });

  }
  afterFromChartAccent() {
    this.descriptionRule = this.assembleDescriptionRules([
    ['An interval ranges from $(rangeFrom) to $(rangeTo) on $(targetAxis) axis', true],
    [', labeled as "$(label)".', false, '.']
    ]);
    this.children.forEach(child => child.afterFromChartAccent());
  }
}

export class RelationalHighlightRange extends Highlight {
  constructor(
    annotation: ChartAccent.Annotation,
    _root: ChartSpec, _parent: CoordinateRange
  ) {
    super(annotation, _root, _parent);
    this._tagname = 'Within or Outside';
    this.attributes = {
      ...this.attributes,
      relation: new AttrInputSelect(['within', 'outside'], 'within')
    };

    const mode = this.annotation.target_inherit.mode;
    this.attributes.relation.value = mode.startsWith('within') ? 'within' : 'outside';
    // this._tagname = firstLetterUpperCase(this.attributes.relation.value);

    this.properties = {
      ...this.properties,
      rangeFrom: () => this._parent.properties.rangeFrom(),
      rangeTo: () => this._parent.properties.rangeTo(),
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

  afterFromChartAccent() {
    this.descriptionRule = [
      '$(relation) the range are $(numTargets) bars. $(highlight) $(itemLabel) Specifically, targets are $(targetDescription).'
    ].join(' ');
  }

  getTargetLocation(): [Item, number[]][] {
    const seriesIndices = this.annotation.target_inherit.serieses.map(series => +series.slice(1) - 2);
    const locations = [];
    const axis = this._parent.properties.targetAxis();
    seriesIndices.forEach(seriesIndex => {
      const series = this._root.legend.children[seriesIndex];
      const bars = this._root.marks.children.map(bargroup => bargroup.children[seriesIndex]) as Bar[];
      const rangeFrom = this.properties.rangeFrom();
      const rangeTo = this.properties.rangeTo();
      const mode = this.attributes.relation.value;
      let indices: number[];
      if (axis === 'x') {
        const ticks = this._root.x.children.map((tick, i) => [tick, i]);
        const rangeFromIndex = ticks.find(([tick, i]: [Tick, number]) => {
          return tick.properties.text() === rangeFrom;
        })[1] as number;
        const rangeToIndex = ticks.find(([tick, i]: [Tick, number]) => {
          return tick.properties.text() === rangeTo;
        })[1] as number;
        indices = [];
        if (mode === 'within') {
          for (let i = rangeFromIndex; i <= rangeToIndex; i++) {
            indices.push(i);
          }
        } else {
          for (let i = 0; i < ticks.length; i++) {
            if (i < rangeFromIndex || rangeToIndex < i) {
              indices.push(i);
            }
          }
        }
      } else {
        indices = bars.map((bar, i) => [bar, i]).filter(([bar, i]: [Bar, number]) => {
          const value = bar.properties.value();
          if (mode === 'within') {
            return rangeFrom <= value && value <= rangeTo;
          } else {
            return rangeFrom > value || value > rangeTo;
          }
        }).map(([bar, i]: [Bar, number]) => i);
      }
      locations.push([series, indices]);
    });
    return locations;
  }

}
