import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import * as d3 from 'd3';
import { PropertiesPanelPopupComponent } from './properties-panel-popup/properties-panel-popup.component';

@Component({
  selector: 'app-edit-properties-panel',
  templateUrl: './edit-properties-panel.component.html',
  styleUrls: ['./edit-properties-panel.component.scss']
})
export class EditPropertiesPanelComponent implements OnInit {
  @Input() tag: SpecTag;
  @ViewChild('properties') propertiesTable: ElementRef<HTMLTableElement>;
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

  _editToggle(key: string, index: number) {
    const temp = !this.edit[key];
    Object.keys(this.edit).forEach(key => this.edit[key] = false);
    this.edit[key] = temp;
    if (this.edit[key]) {
      // TODO: remove this black magic
      setTimeout(() => {
        const textArea =
          d3.select(this.propertiesTable.nativeElement)
          .select(`.attr-input-${index}`)
          .node() as HTMLTextAreaElement
        textArea.focus()
      }, 0);
    }
  }

}
