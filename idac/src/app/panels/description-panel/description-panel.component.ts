import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as FuzzySearch from 'fuzzy-search';


@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit {

  @Input() tag: SpecTag;

  @ViewChild('input') textarea: ElementRef<HTMLTextAreaElement>;

  fuzzySearcher: FuzzySearch;

  constructor() { }

  ngOnInit() {
    const keys = Object.keys(this.tag.properties);
    this.fuzzySearcher = new FuzzySearch(keys.map(key => ({ key })), ['key']);
  }

  searchKeyword(keyword: string): string[] {
    return this.fuzzySearcher.search(keyword).map(({key}) => key);
  }


  onInput() {
    const content = this.textarea.nativeElement.value;
    const pos = this.textarea.nativeElement.selectionStart;
    const leftContent = content.slice(0, pos),
          rightContent = content.slice(pos);
    const regexIsOpen = /^([^\$\(\)]*\$\([^\$\(\)]*\)[^\$\(\)]*)*[^\$\(\)]*\$\((?<cand>[^\$\(\)]*)$/;
    const match = leftContent.match(regexIsOpen);
    if (match) {
      const keyword = match.groups.cand + rightContent.split(' ')[0].split(')')[0];
      console.log(this.searchKeyword(keyword));
    }
  }

}
