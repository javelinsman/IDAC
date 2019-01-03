import { ChartInfo } from './chart-info';

export class Tag {
  tagname: string;
  children?: Tag[];
  description_rule: string;
  attributes: any;

  constructor(tagInfo) {
    this.tagname = tagInfo.tagname;
    this.description_rule = tagInfo.description_rule;
    this.attributes = tagInfo.attributes;
  }

  fetchAnnotation?: (...args: any[]) => void;
  describe(info: ChartInfo, tags: Tag[], keyboardEvent: string) {
    let description = this.description_rule;
    const args = this.description_rule.match(/\$\(([^)]*)\)/g)
      .map(d => [d, d.slice(2, -1)]);
    args.forEach(([arg, strip]) =>
      description = description.replace(arg, this.attributes[strip]));
    return description;
  }
}
