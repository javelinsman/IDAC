import { ChartDescription } from './chart-description';

export class Tag {
  public static descriptionRule = '';

  tagname: string;
  children?: Tag[];
  descriptionRule: string;
  attributes: any;

  constructor(tagname: string) {
    this.tagname = tagname;
    this.setDescriptionRule(`<${tagname}> tag.`);
    this.attributes = {};
  }

  fetchAnnotation?: (...args: any[]) => void;

  setDescriptionRule(descriptionRule: string) {
    (this.constructor as any).descriptionRule = descriptionRule;
  }

  getDescriptionRule(): string {
    return (this.constructor as any).descriptionRule;
  }

  describe(info: ChartDescription, tags: Tag[], keyboardEvent: string, queryAnswer: string = null) {
    let description = (this.constructor as any).descriptionRule;
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
