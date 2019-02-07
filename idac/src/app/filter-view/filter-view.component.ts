import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss']
})
export class FilterViewComponent implements OnInit {

  @Input() currentTag: SpecTag;
  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter();
  parents: SpecTag[];

  getAllTagsCache = {};

  constructor() { }

  ngOnInit() {
    console.log(this.getAllTags());
  }

  getAllTags() {
    if (this.getAllTagsCache[this.currentTag._tagname]) {
      this.parents = this.getAllTagsCache[this.currentTag._tagname].parents;
      return this.getAllTagsCache[this.currentTag._tagname].tags;
    }
    const tags = this.currentTag._root.flattenedTags().filter(tag => tag._tagname === this.currentTag._tagname);
    const parents = [];
    tags.forEach(tag => {
      if (!parents.includes(tag._parent)) {
        parents.push(tag._parent);
      }
    });
    const ret = parents.map(_ => []);
    tags.forEach(tag => {
      ret[parents.indexOf(tag._parent)].push(tag);
    });

    this.getAllTagsCache[this.currentTag._tagname] = {
      tags: ret,
      parents: parents
    };
    this.parents = parents;
    return ret;
  }

  _currentTagChange(tag: SpecTag) {
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }

}
