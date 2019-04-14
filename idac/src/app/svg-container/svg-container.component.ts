import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { d3Selection } from '../chartutils';

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

  svg: d3Selection<SVGSVGElement>;
  initialWidth: number;
  initialHeight: number;

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
      this.svgContainerDiv.nativeElement.appendChild(this.svgData.cloneNode(true));
      this.ready.emit();
    }

    this.svg = d3.select(this.svgContainerDiv.nativeElement).select('svg');

    this.initialWidth = +this.svg.attr('width');
    this.initialHeight = +this.svg.attr('height');
    this.svg.attr('viewBox', `0 0 ${this.initialWidth} ${this.initialHeight + 20}`);
    this.svg.attr('width', '100%');
    this.svg.attr('height', '100%');
  }

  resize(width: number|string, height: number|string) {
    this.svg.attr('width', width);
    this.svg.attr('height', height);
  }

}
