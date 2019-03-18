import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { MessageService } from '../message.service';
import * as d3 from 'd3';
import { ChartSpecService } from '../chart-spec.service';

@Component({
  selector: 'app-chart-spec',
  templateUrl: './chart-spec.component.html',
  styleUrls: ['./chart-spec.component.scss']
})
export class ChartSpecComponent implements OnInit, AfterViewChecked {

  chartSpec: ChartSpec;
  currentTag: SpecTag;

  @ViewChild('container') containerDiv: ElementRef;

  edit = false;

  constructor(
    private messageService: MessageService,
    private chartSpecService: ChartSpecService,
  ) { }

  ngOnInit() {
    if (!this.chartSpec) {
      this.chartSpec = new ChartSpec();
    }
    this.chartSpecService.bindChartSpec(this);
  }

  ngAfterViewChecked() {
    if (this.messageService.shouldScroll) {
      this.messageService.shouldScroll = false;
      const elem = this.containerDiv.nativeElement as HTMLDivElement;
      const highlightedTag = d3.select(elem).select('.spec-tag.highlighted').node() as any;
      if (highlightedTag) {
        highlightedTag.scrollIntoView({block: 'center'});
      }
    }
  }

  _currentTagChange(tag: SpecTag) {
    // console.log(`My name is ChartSpecComponent and I am changing currentTag into ${tag._tagname}`);
    this.currentTag = tag;
    this.currentTagChange.emit(this.currentTag);
  }

}
