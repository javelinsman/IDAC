import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-properties-panel-popup',
  templateUrl: './properties-panel-popup.component.html',
  styleUrls: ['./properties-panel-popup.component.scss']
})
export class PropertiesPanelPopupComponent implements OnInit {

  @Input() tag: SpecTag;
  edit = {};

  constructor() { }

  ngOnInit() {
    Object.keys(this.tag.attributes).forEach(key => {
      this.edit[key] = false;
    });
  }

  isAttribute(key: string) {
    return Object.keys(this.tag.attributes).includes(key);
  }


}
