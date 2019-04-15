import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartExampleService } from '../chart-example.service';
import { Chart } from '../chart';

import * as d3 from 'd3';
import { StageStateService } from '../stage-state.service';
import { inputConfigs } from './input-config';
import { ChartAccentHandler } from '../chart-structure/chart-accent/chart-accent-handler';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})
export class LoadDataComponent implements OnInit {

  charts: Chart[];

  inputConfigs = inputConfigs;
  svg: any;
  json: any;

  @Output() inputDataConfirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private chartExampleService: ChartExampleService,
    private stageStateService: StageStateService,
  ) { }

  ngOnInit() {
    this.charts = this.chartExampleService.getCharts();
  }

  onFileInput(event, config) {
    const file = event.target.files[0];
    if (file.type !== config.filetype) {
      config.errorMessage = 'Invalid file type!';
      return;
    }
    const blobURL = window.URL.createObjectURL(file);
    d3[config.filetypeShort](blobURL).then(data => {
      config.fileName = file.name;
      this[config.filetypeShort] = data;
      this.stageStateService.stageState.load[config.filetypeShort] = data;
    })
  }

  confirmData(svg, json) {
    if (true) { // chartAccent
      const svgSel = d3.select(svg.documentElement as unknown as SVGSVGElement);
      const handler = new ChartAccentHandler(json, svgSel);
      const specSVG = handler.convertToSpec();
      const specJSON = json;
      this.stageStateService.stageState.load.svg = specSVG;
      this.stageStateService.stageState.load.json = specJSON;
      this.inputDataConfirm.emit({ specSVG, specJSON });
    }
  }

  _exampleIdChange(d: number) {
    const chart = this.charts[d];
    d3.svg(chart.src_svg).then(svg => {
      d3.json(chart.src_json).then(json => {
        this.confirmData(svg, json);
      })
    });
  }

  uploadSVG() {
    document.getElementById('idac-input-svg').click();
  }

  uploadJSON() {
    document.getElementById('idac-input-json').click();
  }

}
