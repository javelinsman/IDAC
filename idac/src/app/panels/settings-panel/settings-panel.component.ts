import { Component, OnInit, Input } from '@angular/core';
import { StageState, AudioControlSpeed, KeyboardNavigationKeyBinding, Settings, AudioControl, KeyboardNavigation } from 'src/app/stage-state';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit {

  constructor() { }

  EnumSpeed = AudioControlSpeed
  EnumKeyBinding = KeyboardNavigationKeyBinding

  ngOnInit() {
  }


}
