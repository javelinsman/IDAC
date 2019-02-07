import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-properties-panel-popup',
  templateUrl: './properties-panel-popup.component.html',
  styleUrls: ['./properties-panel-popup.component.scss']
})
export class PropertiesPanelPopupComponent implements OnInit {

  @Input() tag: SpecTag;
  @ViewChild('cardSection') cardSection: ElementRef;
  edit = {};
  dragging = false;
  offset = {
    x: 0,
    y: 0
  };

  constructor() { }

  ngOnInit() {
    Object.keys(this.tag.attributes).forEach(key => {
      this.edit[key] = false;
    });
    this.cardSection.nativeElement.style.left = '300px';
    this.cardSection.nativeElement.style.top = '300px';
  }

  isAttribute(key: string) {
    return Object.keys(this.tag.attributes).includes(key);
  }

  onPanelMousedown(event: MouseEvent) {
    event.preventDefault();
    this.dragging = true;
    this.offset.x = event.clientX - parseInt(this.cardSection.nativeElement.style.left, 10);
    this.offset.y = event.clientY - parseInt(this.cardSection.nativeElement.style.top, 10);
    document.onmousemove = this.onPanelMousemove.bind(this);
  }

  onPanelMouseup(event: MouseEvent) {
    event.preventDefault();
    this.dragging = false;
    document.onmousemove = null;
  }

  onPanelMousemove(event: MouseEvent) {
    event.preventDefault();
    if (this.dragging) {
      this.cardSection.nativeElement.style.left = `${event.clientX - this.offset.x}px`;
      this.cardSection.nativeElement.style.top = `${event.clientY - this.offset.y}px`;
    }
  }
}
