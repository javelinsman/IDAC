import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Stage, StageState } from '../index/index.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  Stage = Stage;

  @Input() stage: Stage;
  @Input() stageState: StageState;

  @Output() stageChange: EventEmitter<Stage> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  _toggleSetting() {
    if (!this.stageState.describe.toolbarSetting) {
      this.stageState.describe.toolbarHelp = false;
    }
    this.stageState.describe.toolbarSetting =
      !this.stageState.describe.toolbarSetting;
  }

  _toggleHelp() {
    if (!this.stageState.describe.toolbarHelp) {
      this.stageState.describe.toolbarSetting = false;
    }
    this.stageState.describe.toolbarHelp =
      !this.stageState.describe.toolbarHelp;
  }

}
