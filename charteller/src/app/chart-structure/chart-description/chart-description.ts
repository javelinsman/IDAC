import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';
import { ChartSpec } from '../chart-spec/chart-spec';

export class ChartDescription {
    tagname: 'graph';
    children: [ Title, Y, X, Legend, Marks ]; // , Y, X, Legend, Marks, Annotations ];

    constructor(cs: ChartSpec) {
      this.children = [
        new Title(cs),
        new Y(cs),
        new X(cs),
        new Legend(cs),
        new Marks(cs),
        // new Annotations(cs),
      ];
    }

    flattenedTags() {
      let idCount = 0;
      const tags = [];
      function assignId(tag) {
        tag['_id'] = idCount++;
        tags.push(tag);
        if (tag['children']) {
          tag['children'].forEach(childTag => {
            childTag['parentId'] = tag['_id'];
            assignId(childTag);
          });
        }
      }
      assignId(this);
      return tags;
    }
}
