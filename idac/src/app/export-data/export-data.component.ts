import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { StageStateService } from '../stage-state.service';
import { ChartSpecService } from '../chart-spec.service';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import * as d3 from 'd3';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit, AfterViewInit {

  constructor(
    private stageStateService: StageStateService,
    private chartSpecService: ChartSpecService,
    private sanitizer: DomSanitizer
  ) { }

  chartSpec: ChartSpec;
  currentTag: SpecTag;
  specSVG: any;
  specJSON: any;

  exportHTML: string;
  blob: Blob;
  blobURL: string;
  safeBlobURL: SafeUrl;

  @ViewChild('container') containerDiv: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
    this.specSVG = this.stageStateService.stageState.load.svg;
    this.specJSON = this.stageStateService.stageState.load.json;
    const svgAsString = this.domToString(this.specSVG.node());
    d3.text('./assets/index-template.html').then(data => {
      this.exportHTML = data
        .replace('PLACE_TO_PUT_TITLE', this.chartSpec.title.attributes.title.value)
        .replace('PLACE_TO_PUT_SVG_DATA', '`' + svgAsString + '`')
        .replace('PLACE_TO_PUT_JSON_DATA', JSON.stringify(this.specJSON))
        .replace('PLACE_TO_PUT_CHART_SPEC_DATA', JSON.stringify(this.stringifyChartSpec(this.chartSpec)));
      console.log(this.exportHTML);
      this.blob = new Blob([this.exportHTML], {type: 'text/html'});
      this.blobURL = URL.createObjectURL(this.blob);
      this.safeBlobURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobURL);
    });
  }

  ngAfterViewInit() {
    this.onWindowResize();
  }

  stringifyChartSpec(tag: SpecTag) {
    return {
      attributes: tag.attributes,
      properties: Object.entries(tag.properties).reduce((accum, [key, value]) => { accum[key] = value(); return accum; }, {}),
      descriptionRule: tag.descriptionRule,
      editorsNote: tag.editorsNote,
      active: tag['active'],
      _children: tag._children.map(childTag => this.stringifyChartSpec(childTag))
    }
  }

  domToString(dom) {
    const temp = document.createElement('div');
    temp.appendChild(dom);
    return temp.innerHTML;
  }

  download() {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = this.blobURL; // 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'narratable.html';
    hiddenElement.click();
  }

  onWindowResize() {
    if (this.containerDiv) {
      const mainHeight = `${window.innerHeight - 20 - 50}px`;
      d3.select(this.containerDiv.nativeElement).style('height', mainHeight);
    }
  }


}
