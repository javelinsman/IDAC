import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartExampleService } from '../chart-example.service';
import { Chart } from '../chart';

import * as d3 from 'd3';
import { StageStateService } from '../stage-state.service';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})
export class LoadDataComponent implements OnInit, AfterViewInit {

  charts: Chart[];

  inputConfigs = [
    {
      filetype: 'image/svg+xml',
      filetypeShort: 'svg',
      errorMessage: '',
      fileName: '',
      defaultHint: 'SVG file (or chartaccent.svg)'
    },
    {
      filetype: 'application/json',
      filetypeShort: 'json',
      errorMessage: '',
      fileName: '',
      defaultHint: 'JSON file (or chartaccent.json)'
    }

  ]

  @Output() exampleIdChange: EventEmitter<number> = new EventEmitter();

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
      this.stageStateService.stageState.load[config.filetypeShort] = data;
    })
  }

  _exampleIdChange(d: number) {
    this.exampleIdChange.emit(d);
  }


}
