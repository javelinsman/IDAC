import { Tag } from './tag';
import * as ChartSpec from '../chart-spec/chart-spec'; 

export class X extends Tag {

  constructor(cs: ChartSpec.ChartSpec) {
    super('x');
    this.children = () => cs.x.ticks.value.map((tick, index) => new Tick(tick, index, cs));
    this.attributes = {
      label: () => cs.x.label.value ? cs.x.label.value : 'not specified',
      unit: () => cs.x.unit.value ? cs.x.unit.value : 'not specified',
      numTicks: () => this.children().length,
      listOfTicks: () => this.children().map(d => d.attributes.tick()).join(', ')
    };
    this.setDescriptionRule([
      'X axis with label name $(label).',
      'The unit of measurement is $(unit).',
      'There are $(numTicks) tick marks: $(listOfTicks).',
    ].join(' '));
  }
}

export class Tick extends Tag {
  constructor(tick: ChartSpec.Tick, index: number, cs: ChartSpec.ChartSpec) {
    super('tick');
    this.setDescriptionRule([
      '$(tick) $(unit)'
    ].join(' '));

    this.attributes = {
      tick: () => tick.text.value,
      unit: () => cs.x.unit.value,
      index: () => index,
    };
  }
}
