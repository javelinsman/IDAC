import { Component, OnInit } from '@angular/core';
import { defaultStageState } from '../stage-state';

export enum Stage {
  load,
  describe,
  export
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  Stage = Stage;
  exampleId: number;
  currentStage = Stage.load;

  stageState = defaultStageState;

  constructor(
  ) { }

  ngOnInit() {
  }

  _exampleIdChange(event) {
    this.exampleId = event;
    this.currentStage = Stage.describe;
  }

}
