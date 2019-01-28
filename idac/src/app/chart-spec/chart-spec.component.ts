import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-chart-spec',
  templateUrl: './chart-spec.component.html',
  styleUrls: ['./chart-spec.component.scss']
})
export class ChartSpecComponent implements OnInit, AfterViewChecked {

  @Input() chartSpec: ChartSpec;
  @Input() currentTag: SpecTag;

  @ViewChild('container') containerDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.chartSpec) {
      this.chartSpec = new ChartSpec();
    }
  }

  ngAfterViewChecked() {
    const elem = this.containerDiv.nativeElement as any;
    Array.from(elem.getElementsByClassName('highlight'))
      .forEach((dom: any) => dom.scrollIntoView({block: 'center'}));
  }

}
