import { ChartInfo } from './chart-info';

export class Tag {
  tagname: string;
  children?: Tag[];
  descriptionRule: string;
  attributes: any;

  constructor(tagname: string) {
    this.tagname = tagname;
    this.descriptionRule = `<${tagname}> tag.`;
    this.attributes = {};
  }

  fetchAnnotation?: (...args: any[]) => void;
  describe(info: ChartInfo, tags: Tag[], keyboardEvent: string) {
    let description = this.descriptionRule;
    const args = this.descriptionRule.match(/\$\(([^)]*)\)/g);
    if (args) {
      args.map(d => [d, d.slice(2, -1)])
        .forEach(([arg, strip]) =>
          description = description.replace(arg, this.attributes[strip]));
    }
    return description;
  }
}
