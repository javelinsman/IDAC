import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-properties-panel-popup',
  templateUrl: './properties-panel-popup.component.html',
  styleUrls: ['./properties-panel-popup.component.scss']
})
export class PropertiesPanelPopupComponent implements OnInit {

  @Input() tag: SpecTag;
  activeTag: SpecTag;
  @ViewChild('cardSection') cardSection: ElementRef;
  edit = {};
  dragging = false;
  show = false;

  offset = {
    x: 0,
    y: 0
  };

  constructor() { }

  ngOnInit() {
    this.initForActiveTag();
    this.activeTag = this.tag;
  }

  initForActiveTag() {
    this.edit = {};
    Object.keys(this.tag.attributes).forEach(key => {
      this.edit[key] = false;
    });
  }

  toggle(popupParent: HTMLElement = null) {
    this.show = !this.show;
    if (this.show) {
      const bBox = popupParent.getBoundingClientRect();
      const bBoxThis = this.cardSection.nativeElement.getBoundingClientRect();

      this.cardSection.nativeElement.style.left =
        `${bBox.left - bBoxThis.width - 20}px`;
      this.cardSection.nativeElement.style.top =
        `${bBox.top - 110}px`;


      if (bBoxThis.top + bBoxThis.height > window.innerHeight) {
        this.cardSection.nativeElement.style.top = `${window.innerHeight - bBoxThis.height}px`;
      }
    }
  }

  isAttribute(key: string) {
    return Object.keys(this.activeTag.attributes).includes(key);
  }

  onPropertyNameDragStart(event: DragEvent) {
    const prefix = this.tag === this.activeTag ? '' : `${this.activeTag._tagname}: `;
    event.dataTransfer.setData('text/plain', `$(${prefix + (event.target as HTMLElement).innerText})`);
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
