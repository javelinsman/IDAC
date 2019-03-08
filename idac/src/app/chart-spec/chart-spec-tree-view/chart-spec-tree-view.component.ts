import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked, ChangeDetectorRef, ElementRef, ViewChild, AfterContentChecked } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { OnClickOutside } from 'src/app/utils';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-chart-spec-tree-view',
  templateUrl: './chart-spec-tree-view.component.html',
  styleUrls: ['./chart-spec-tree-view.component.scss']
})
export class ChartSpecTreeViewComponent implements OnInit, AfterViewChecked, AfterContentChecked {

  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() indent: number;
  @Input() isCollapsed: any;
  @Input() siblingIndex: number;
  @Input() siblingLength: number;
  @Input() parentCollapseIndex = 0;
  @Input() edit: boolean;
  @Input() viewOnly = false;
  @Input() minimize = false;

  @Output() currentTagChange: EventEmitter<SpecTag> = new EventEmitter();
  @Output() parentCollapseIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() editChange: EventEmitter<boolean> = new EventEmitter();
  @Output() collapseToggle: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('tagSection') tagSection: ElementRef;


  editPanel = 'template';
  numAttributes: number;

  collapsable = false;
  collapseChildren = false;
  collapseChildrenTemporary = false;
  collapseIndex = 0;

  hover: boolean;
  tagIncludesCurrentTagCache = {}

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    if (!this.indent) {
      this.indent = 0;
    }
    this.numAttributes = Object.entries(this.tag.attributes).length;
    if (this.tag.children && this.tag.children.length > 1) {
      this.collapsable = true;
    }
    this.siblingIndex = this.tag._parent.children.indexOf(this.tag);
    this.siblingLength = this.tag._parent.children.length;

    if (this.tag.children && this.tag.children.length > 1 && (!this.tag.children[0].children || !this.tag.children[0].children.length)) {
      // this.collapseChildren = true;
    }
  }

  ngAfterViewChecked() {
    if (this.tag.flattenedTags().indexOf(this.currentTag) >= 0) {
      this.parentCollapseIndexChange.emit(this.siblingIndex);
      this.changeDetectorRef.detectChanges();
    }
  }

  tagIncludesCurrentTag() {
    if (!this.tagIncludesCurrentTagCache[this.currentTag._id]) {
      this.tagIncludesCurrentTagCache[this.currentTag._id] = this.tag.children.includes(this.currentTag);
    }
    return this.tagIncludesCurrentTagCache[this.currentTag._id];
  }

  ngAfterContentChecked() {
    if (this.messageService.shouldCollapse) {
      if (this.currentTag._parent === this.currentTag._root) {
        this.messageService.shouldCollapse = false;
      } else if (this.tag.children && this.tagIncludesCurrentTag()) {
        this.collapseChildren = true;
        this.collapseChildrenTemporary = true;
        this.messageService.shouldCollapse = false;
      }
    }
    if (this.collapseChildrenTemporary && !this.tagIncludesCurrentTag()) {
      this.collapseChildren = false;
      this.collapseChildrenTemporary = false;
    }
  }

  _currentTagChange(tag: SpecTag) {
    // console.log(`My name is ${this.tag._tagname} and I am changing currentTag into ${tag._tagname}`);
    if (this.currentTag !== tag) {
      this.edit = false;
    }
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }

  _editChange(edit: boolean) {
    this.edit = edit;
    if (edit) {
      OnClickOutside(this.tagSection.nativeElement, () => {
        this._editChange(false);
      });
    }
    // this.editChange.emit(edit);
  }

  onSectionClick() {
  }

  increase() {
    if (this.siblingIndex + 1 < this.siblingLength) {
      this._currentTagChange(this.tag._parent.children[this.siblingIndex + 1]);
      // this.parentCollapseIndexChange.emit(this.siblingIndex);
    }
  }

  decrease() {
    if (this.siblingIndex - 1 >= 0) {
      this._currentTagChange(this.tag._parent.children[this.siblingIndex - 1]);
      // this.parentCollapseIndexChange.emit(this.siblingIndex);
    }
  }

  _collapseToggle() {
    this.collapseToggle.emit(!this.isCollapsed);
  }

}
