import { Component, OnInit } from '@angular/core';
import { Chart } from '../chart';
import { ChartExampleService } from '../chart-example.service';
import { HttpClient } from '@angular/common/http';

export enum Stage {
  load,
  describe,
  export
}

export interface StageState {
  load: StageStateLoad;
  describe: StageStateDescribe;
  export: StageStateExport;
}

type StageStateLoad = any;

interface StageStateDescribe {
  toolbarSetting: boolean;
  toolbarHelp: boolean;
}

type StageStateExport = any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  Stage = Stage;
  exampleId: number;
  currentStage = Stage.load;

  stageState: StageState = {
    load: {},
    describe: {
      toolbarSetting: false,
      toolbarHelp: false,
    },
    export: {}
  }

  constructor(
  ) { }

  ngOnInit() {
  }

  _exampleIdChange(event) {
    this.exampleId = event;
    this.currentStage = Stage.describe;
  }

}
