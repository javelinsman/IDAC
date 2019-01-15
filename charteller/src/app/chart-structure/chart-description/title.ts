import { Tag } from './tag';
import { ChartSpec } from '../chart-spec/chart-spec';

export class Title extends Tag {
  constructor(cs: ChartSpec) {
    super('title');
    this.attributes = {
      title: () => cs.title.title.value,
    };
    this.setDescriptionRule('Chart title: $(title).');
  }

}
