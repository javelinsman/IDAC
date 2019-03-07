import { ChartAccent } from '../chart-accent/chart-accent';
import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';
import { SpecTag } from './spec-tag';
import { d3Selection } from 'src/app/chartutils';

export class ChartSpec extends SpecTag {
  title = new Title(this);
  y = new Y(this);
  x = new X(this);
  legend = new Legend(this);
  marks = new Marks(this);
  annotations = new Annotations(this);

  chartType: string;

  _flattendTags: SpecTag[];

  constructor() {
    super('ChartSpec');
    this.children = [
      this.title, this.y, this.x, this.legend, this.marks, this.annotations
    ];
  }

  fromChartAccent(ca: ChartAccent) {
    this.children.forEach(tag => tag.fromChartAccent(ca));
    this.children.forEach(tag => tag.afterFromChartAccent());
    this._flattendTags = null; // assure that flattend tags will be updated
    this.chartType = ca.chart.type;
  }

  fromSpecSVG(spec: d3Selection<SVGSVGElement>) {
    this.chartType = spec.attr('ca-chart-type');
    this.children.forEach(tag => tag.fromSpecSVG(spec));
    this.children.forEach(tag => tag.afterFromSpecSVG());
    this._flattendTags = null; // assure that flattend tags will be updated
  }


  flattenedTags() {
    if (!this._flattendTags) {
      this._flattendTags = [
        ...this.title.flattenedTags(),
        ...this.y.flattenedTags(),
        ...this.x.flattenedTags(),
        ...this.legend.flattenedTags(),
        ...this.marks.flattenedTags(),
        ...this.annotations.flattenedTags()
      ];
    }
    return this._flattendTags;
  }

  findById(id: number) {
    return this.flattenedTags().find(tag => tag._id === id);
  }

}
