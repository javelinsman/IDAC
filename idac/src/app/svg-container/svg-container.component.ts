import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-svg-container',
  templateUrl: './svg-container.component.html',
  styleUrls: ['./svg-container.component.scss']
})
export class SvgContainerComponent implements OnInit, AfterViewInit {

  @Input() src: string;
  @Input() svgData: SVGSVGElement;
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @ViewChild('svgContainer') svgContainerDiv: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.src) {
      d3.svg(this.src).then(data => {
        this.svgContainerDiv.nativeElement.appendChild(data.documentElement);
        this.ready.emit();
      });
    } else {
      this.svgContainerDiv.nativeElement.appendChild(this.svgData);
      this.ready.emit();
    }
  }

}
