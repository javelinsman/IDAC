import { Component, OnInit, Input } from '@angular/core';
import { defaultStageState, StageState } from 'src/app/stage-state';

@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss']
})
export class HelpPanelComponent implements OnInit {

  @Input() stageState: StageState;

  constructor() { }

  ngOnInit() {
  }

}
