import { Component, OnInit, Input } from '@angular/core';
import { StageState, AudioControlSpeed, KeyboardNavigationKeyBinding, Settings, AudioControl, KeyboardNavigation } from 'src/app/stage-state';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit {

  @Input() stageState: StageState;

  settings: Settings;
  audioControl: AudioControl;
  keyboardNavigation: KeyboardNavigation;

  EnumSpeed = AudioControlSpeed
  EnumKeyBinding = KeyboardNavigationKeyBinding

  constructor() { }

  ngOnInit() {
    this.settings = this.stageState.describe.settings
    this.audioControl = this.settings.audioControl;
    this.keyboardNavigation = this.settings.keyboardNavigation;
  }


}
