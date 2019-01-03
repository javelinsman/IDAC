import { ChartInfo } from './chart-info';

export class Tag {
  tagname: string;
  children?: Tag[];
  description_rule: string;
  attributes: any;

  constructor(tagname: string) {
    this.tagname = tagname;
    this.description_rule = `<${tagname}> tag.`;
    this.attributes = {};
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
