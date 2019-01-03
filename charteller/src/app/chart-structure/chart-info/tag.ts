import { ChartInfo } from './chart-info';

export class Tag {
  tagname: string;
  children?: Tag[];
  description_rule: string;

  constructor(tagname: string) {
    this.tagname = tagname;
  }

  fetchAnnotation?: (...args: any[]) => void;
  describe(info: ChartInfo, tags: Tag[], keyboardEvent: string) {
    let description = this.description_rule;
    const args = this.description_rule.match(/\$\(([^)]*)\)/g)
      .map(d => [d, d.slice(2, -1)]);
    args.forEach(([arg, strip]) => description = description.replace(arg, this[strip]));
    return description;
  }
}
