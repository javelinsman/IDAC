import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnInit {
  @Input() tag: SpecTag;
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
