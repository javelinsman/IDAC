import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Stage } from '../stage-state';
import { StageStateService } from '../stage-state.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  Stage = Stage;
  stage: Stage;

  toolbarSetting: boolean;
  toolbarHelp: boolean;

  constructor(
    public stageStateService: StageStateService
  ) { }

  ngOnInit() {
    this.stageStateService.stageObservable.subscribe(stage => {
      this.stage = stage;
    })
    this.stageStateService.toolbarSettingObservable.subscribe(toolbarSetting => {
      this.toolbarSetting = toolbarSetting;
    });
    this.stageStateService.toolbarHelpObservable.subscribe(toolbarHelp => {
      this.toolbarHelp = toolbarHelp;
    });
  }

  _toggleSetting() {
    if (!this.toolbarSetting){
      this.stageStateService.toolbarHelp = false;
    }
    this.stageStateService.toolbarSetting = !this.toolbarSetting;
  }

  _toggleHelp() {
    if (!this.toolbarHelp){
      this.stageStateService.toolbarSetting = false;
    }
    this.stageStateService.toolbarHelp = !this.toolbarHelp;
  }

}
