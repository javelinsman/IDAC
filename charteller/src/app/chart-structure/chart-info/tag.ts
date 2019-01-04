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
  describe(info: ChartInfo, tags: Tag[], keyboardEvent: string, queryAnswer: string = null) {
    let description = this.descriptionRule;
    if (queryAnswer) {
      description = queryAnswer + ' ' + description;
      console.log(description);
    }
    const args = description.match(/\$\(([^)]*)\)/g);
    if (args) {
      args.map(d => [d, d.slice(2, -1)])
        .forEach(([arg, strip]) =>
          description = description.replace(arg, this.attributes[strip]));
    }
    return description;
  }
}
