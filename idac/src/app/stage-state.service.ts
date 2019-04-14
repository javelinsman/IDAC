import { Injectable } from '@angular/core';
import { AudioControl, KeyboardNavigation, Settings, StageState, Stage, AudioControlSpeed, KeyboardNavigationKeyBinding } from './stage-state';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageStateService {

  stageState: StageState =  {
    stage: new BehaviorSubject(Stage.load),
    load: {
      json: null,
      svg: null,
    },
    describe: {
      toolbarSetting: new BehaviorSubject(false),
      toolbarHelp: new BehaviorSubject(false),
      settings: {
        audioControl: {
          readAloudElements: new BehaviorSubject(true),
          speed: new BehaviorSubject(AudioControlSpeed.normal),
        },
        keyboardNavigation: {
          hint: new BehaviorSubject(true),
          keyBinding: new BehaviorSubject(KeyboardNavigationKeyBinding.nvda),
        }
      }
    },
    export: {}
  };

  state: StageState;
  settings: Settings;
  audioControl: AudioControl;
  keyboardNavigation: KeyboardNavigation;

  constructor() {
    this.settings = this.stageState.describe.settings;
    this.audioControl = this.settings.audioControl;
    this.keyboardNavigation = this.settings.keyboardNavigation;
  }

  get stage() { return this.stageState.stage.getValue(); }
  set stage(stage) { this.stageState.stage.next(stage); }
  get stageObservable() { return this.stageState.stage.asObservable(); }

  get toolbarSetting() { return this.stageState.describe.toolbarSetting.getValue(); }
  set toolbarSetting(set) { this.stageState.describe.toolbarSetting.next(set); }
  get toolbarSettingObservable() { return this.stageState.describe.toolbarSetting.asObservable(); }

  get toolbarHelp() { return this.stageState.describe.toolbarHelp.getValue(); }
  set toolbarHelp(set) { this.stageState.describe.toolbarHelp.next(set); }
  get toolbarHelpObservable() { return this.stageState.describe.toolbarHelp.asObservable(); }

  get readAloudElements() { return this.settings.audioControl.readAloudElements.getValue(); }
  set readAloudElements(set) { this.settings.audioControl.readAloudElements.next(set); }
  get readAloudElementsObservable() { return this.settings.audioControl.readAloudElements.asObservable(); }

  get speed() { return this.settings.audioControl.speed.getValue(); }
  set speed(set) { this.settings.audioControl.speed.next(set); }
  get speedObservable() { return this.settings.audioControl.speed.asObservable(); }

  get hint() { return this.settings.keyboardNavigation.hint.getValue(); }
  set hint(set) { this.settings.keyboardNavigation.hint.next(set); }
  get hintObservable() { return this.settings.keyboardNavigation.hint.asObservable(); }

  get keyBinding() { return this.settings.keyboardNavigation.keyBinding.getValue(); }
  set keyBinding(set) { this.settings.keyboardNavigation.keyBinding.next(set); }
  get keyBindingObservable() { return this.settings.keyboardNavigation.keyBinding.asObservable(); }

}
