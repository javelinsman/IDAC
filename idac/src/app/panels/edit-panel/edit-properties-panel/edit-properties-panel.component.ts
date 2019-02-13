import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { PropertiesPanelPopupComponent } from './properties-panel-popup/properties-panel-popup.component';

@Component({
  selector: 'app-edit-properties-panel',
  templateUrl: './edit-properties-panel.component.html',
  styleUrls: ['./edit-properties-panel.component.scss']
})
export class EditPropertiesPanelComponent implements OnInit {
  @Input() tag: SpecTag;
  @ViewChild(PropertiesPanelPopupComponent) propertiesPanelPopupComponent: PropertiesPanelPopupComponent;
  edit = {};

  constructor() { }

  isAttribute(key: string) {
    return Object.keys(this.tag.attributes).includes(key);
  }

  ngOnInit() {
    Object.keys(this.tag.attributes).forEach(key => {
      this.edit[key] = false;
    });
  }

  onDragStart(event: DragEvent) {
    event.dataTransfer.setData('text/plain', `$(${(event.target as HTMLElement).innerText})`);
  }

}
