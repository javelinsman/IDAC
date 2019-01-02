import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';
import { ChartAccent } from '../chart-accent/chart-accent';

export class ChartInfo {
    tagname: 'graph';
    children: [ Title, Y, X, Legend, Marks, Annotations ];

    constructor(ca: ChartAccent) {
      this.children = [
        new Title(ca),
        new Y(ca),
        new X(ca),
        new Legend(ca),
        new Marks(ca),
        new Annotations(ca),
      ];
    }

    flattenedTags() {
      let idCount = 0;
      const tags = [];
      function assignId(tag) {
        tag._id = idCount++;
        tags.push(tag);
        if (tag.children) {
          tag.children.forEach(childTag => {
            childTag.parentId = tag._id;
            assignId(childTag);
          });
        }
      }
      assignId(this);
      return tags;
    }
}
