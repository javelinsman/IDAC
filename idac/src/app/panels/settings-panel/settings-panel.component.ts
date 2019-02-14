import { Component, OnInit, Input } from '@angular/core';
import { StageState, AudioControlSpeed, KeyboardNavigationKeyBinding, Settings, AudioControl, KeyboardNavigation } from 'src/app/stage-state';
import { StageStateService } from 'src/app/stage-state.service';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit {

  constructor(
    public stageStateService: StageStateService
  ) { }

  AudioControlSpeed = AudioControlSpeed
  KeyboardNavigationKeyBinding = KeyboardNavigationKeyBinding

  readAloudElements: boolean;
  speed: AudioControlSpeed;
  keyBinding: KeyboardNavigationKeyBinding;
  hint: boolean;


  ngOnInit() {
    this.stageStateService.readAloudElementsObservable
      .subscribe(readAloudElement => {
        this.readAloudElements = readAloudElement;
      });
    this.stageStateService.speedObservable
      .subscribe(speed => {
        this.speed = speed;
      });
    this.stageStateService.keyBindingObservable
      .subscribe(keyBinding => {
        this.keyBinding = keyBinding;
      });
    this.stageStateService.hintObservable
      .subscribe(hint => {
        this.hint = hint;
      });
  }


}
