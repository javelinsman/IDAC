import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-svg-container',
  templateUrl: './svg-container.component.html',
  styleUrls: ['./svg-container.component.scss']
})
export class SvgContainerComponent implements OnInit, AfterViewInit {

  @Input() src: string;
  @ViewChild('svgContainer') svgContainerDiv: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    d3.svg(this.src).then(data => {
      this.svgContainerDiv.nativeElement.appendChild(data.documentElement);
    });
  }

}
