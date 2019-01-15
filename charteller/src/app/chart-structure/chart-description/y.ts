import { Tag } from './tag';
import { ChartSpec } from '../chart-spec/chart-spec';

export class Y extends Tag {
  tagname: 'y';
  min: number;
  max: number;
  label: string;
  unit: string;

  constructor(cs: ChartSpec) {
    super('y');
    const maxValue = () => cs.marks.bargroups.value.map(bargroup => bargroup.bars.value.map(bar => bar.value.value))
      .reduce((a, b) => [...a, ...b], [])
      .reduce((a, b) => a > b ? a : b, 0);
    this.attributes = {
      min: () => +cs.y.rangeMin.value,
      max: () => cs.y.rangeMax.value ? +cs.y.rangeMax.value : maxValue(),
      label: () => cs.y.label.value,
      unit: () => cs.y.unit.value,
    };

    this.setDescriptionRule([
      'Y axis with label name $(label).',
      'The unit of measurement is $(unit).',
      'The range is from $(min) to $(max).',
    ].join(' '));

    if (!this.attributes.label) {
      this.attributes.label = 'not specified';
    }
    if (!this.attributes.unit) {
      this.attributes.unit = 'not specified';
    }

  }
}
