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

  constructor() { }

  ngOnInit() {
    console.log(this.getAllTags());
  }

  getAllTags() {
    return this.currentTag._root.flattenedTags().filter(tag => tag._tagname === this.currentTag._tagname);
  }

  _currentTagChange(tag: SpecTag) {
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }

}
