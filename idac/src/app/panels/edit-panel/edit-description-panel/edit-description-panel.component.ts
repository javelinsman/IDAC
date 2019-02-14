import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as FuzzySearch from 'fuzzy-search';
import { Textcomplete, Textarea } from 'textcomplete';


@Component({
  selector: 'app-edit-description-panel',
  templateUrl: './edit-description-panel.component.html',
  styleUrls: ['./edit-description-panel.component.scss']
})
export class EditDescriptionPanelComponent implements OnInit, AfterViewInit {

  @Input() tag: SpecTag;
  @Input() overrideDescription: boolean;
  @Output() overrideDescriptionChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('input') textarea: ElementRef<HTMLTextAreaElement>;
  textComplete: Textcomplete;

  fuzzySearcher: FuzzySearch;

  replaced = false;

  constructor() { }

  ngOnInit() {
    let keys = Object.keys(this.tag.properties);
    this.tag.peekableTags().forEach(tag => {
        keys = [...keys, ...Object.keys(tag.properties).map(key => `${tag._tagname}: ${key}`)];
      });
    this.fuzzySearcher = new FuzzySearch(keys.map(key => ({ key })), ['key'], { sort: true });
  }

  ngAfterViewInit() {
    const editor = new Textarea(this.textarea.nativeElement);
    this.textComplete = new Textcomplete(editor);
    this.textComplete.register([{
      match: /()\$\(((?:\w|\d|\s|\:)*)$/,
      search: (term, callback) => callback(this.searchKeyword(term)),
      replace: (name) => {
        this.replaced = true;
        return `$(${name})`;
      }
    }]);
  }

  onDescriptionChange() {
    if (this.replaced) {
      this.deleteFollowingSegment();
    }
  }

  deleteFollowingSegment() {
    const textarea = this.textarea.nativeElement;
    const pos = textarea.selectionStart;
    const left = textarea.value.slice(0, pos);
    const right = textarea.value.slice(pos);
    const rightNew = right.replace(/^[^()]*\)/, '');
    textarea.value = left + rightNew;
    this.replaced = false;
  }

  searchKeyword(keyword: string): string[] {
    return this.fuzzySearcher.search(keyword).map(({key}) => key);
  }

  onDrop(event: DragEvent) {
    const textarea = this.textarea.nativeElement;
    const propName = event.dataTransfer.getData('text');
    setTimeout(() => { textarea.selectionStart += propName.length; }, 0);
  }

  onDragOver(event: DragEvent) {
    /*
    const textarea = this.textarea.nativeElement;
    console.log(textarea.);
    */
  }

  onDescriptionBlur(event: FocusEvent) {
    if (this.textComplete.dropdown.shown) {
      this.textComplete.dropdown.deactivate();
    }
  }

  _overrideDescriptionChange(override: boolean) {
    this.overrideDescription = override;
    this.overrideDescriptionChange.emit(override);
    if (override)  {
      this.tag.editorsNote.text = this.tag.describe();
    }
    this.tag.editorsNote.active = override;
  }

}
