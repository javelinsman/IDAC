import { Component, OnInit } from '@angular/core';
import { Stage } from '../stage-state';
import { StageStateService } from '../stage-state.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  Stage = Stage;
  currentStage: Stage;

  constructor(
    public stageStateService: StageStateService
  ) { }

  ngOnInit() {
    this.stageStateService.stageObservable
      .subscribe(stage => {
        this.currentStage = stage;
      })
  }

  onInputChange({svg, json}: any) {
    this.stageStateService.stage = Stage.describe;
  }

}
