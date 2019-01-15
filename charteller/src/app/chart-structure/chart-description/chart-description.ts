import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';
import { ChartSpec } from '../chart-spec/chart-spec';
import { Tag } from './tag';

export class ChartDescription extends Tag {
    tagname: 'graph';
    children: () => Tag[];

    title: Title;
    y: Y;
    x: X;
    legend: Legend;
    marks: Marks;
    annotations: Annotations;

    constructor(cs: ChartSpec) {
      super('graph');
      this.title = new Title(cs);
      this.y = new Y(cs);
      this.x = new X(cs);
      // this.legend = new Legend(cs);
      // is.marks = new Marks(cs);
      // is.annotations = new Annotations(cs);
      this.children = () => [
        this.title,
        this.y,
        this.x
        // new Legend(cs),
        // new Marks(cs),
        // new Annotations(cs),
      ];
    }

    flattenedTags() {
      let idCount = 0;
      const tags = [];
      function assignId(tag: Tag) {
        tag._id = idCount++;
        tags.push(tag);
        console.log(tag);
        if (tag.children()) {
          tag.children().forEach(childTag => {
            childTag['parentId'] = tag['_id'];
            assignId(childTag);
          });
        }
      }
      assignId(this);
      console.log(this);
      return tags;
    }
}
