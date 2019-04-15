import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { AttrInput } from './attributes';
import { ChartAccent } from '../chart-accent/chart-accent';
import { d3Selection } from 'src/app/chartutils';

export class Title extends SpecTag {
  constructor(public _root: ChartSpec) {
    super('Title');
    this._parent = _root;
    this.attributes = {
      title: new AttrInput()
    };
  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    const title = spec.select('.ca-title');
    if (!title.size()) { return; }
    this.attributes = {
      title: new AttrInput(title.select('text').text())
    };
  }

  afterFromSpecSVG() {
    this.descriptionRule = this.assembleDescriptionRules([
    ['The title is "$(title)."', true],
    ]);
  }

}
