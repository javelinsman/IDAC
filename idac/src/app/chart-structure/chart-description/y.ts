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
    let maxValue;
    if (cs.marks.type.value === 'grouped') {
      maxValue = cs.marks.bargroups.value.map(bargroup => bargroup.bars.value.map(bar => bar.value.value))
      .reduce((a, b) => [...a, ...b], [])
      .reduce((a, b) => a > b ? a : b, 0);
    } else {
      maxValue = cs.marks.bargroups.value.map(bargroup => bargroup.bars.value.map(bar => bar.value.value))
      .reduce((a, b) => [...a, b.reduce((x, y) => x + y, 0)], [])
      .reduce((a, b) => a > b ? a : b, 0);
    }
    this.attributes = {
      min: +cs.y.rangeMin.value,
      max: cs.y.rangeMax.value ? +cs.y.rangeMax.value : maxValue,
      label: cs.y.label.value ? cs.y.label.value : 'not specified',
      unit: cs.y.unit.value ? cs.y.unit.value : 'not specified',
    };

    this.setDescriptionRule([
      'Y axis with label name $(label).',
      'The unit of measurement is $(unit).',
      'The range is from $(min) to $(max).',
    ].join(' '));

  }
}
