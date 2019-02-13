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

  fuzzySearcher: FuzzySearch;

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
    const textComplete = new Textcomplete(editor);
    textComplete.register([{
      match: /()\$\(([a-zA-Z0-9+\-\_]*)$/,
      search: (term, callback) => callback(this.searchKeyword(term)),
      replace: (name) => `$1$(${name}) `
    }]);
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

  _overrideDescriptionChange(override: boolean) {
    this.overrideDescription = override;
    this.overrideDescriptionChange.emit(override);
    if (override)  {
      this.tag.editorsNote.text = this.tag.describe();
    }
    this.tag.editorsNote.active = override;
  }

}
