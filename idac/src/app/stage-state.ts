import { BehaviorSubject } from 'rxjs';

export enum Stage {
  load,
  describe,
  export
}

export interface StageState {
  stage: BehaviorSubject<Stage>;
  load: StageStateLoad;
  describe: StageStateDescribe;
  export: StageStateExport;
}

export interface StageStateLoad {
  svg: SVGSVGElement;
  json: any;
}

export interface StageStateDescribe {
  toolbarSetting: BehaviorSubject<boolean>;
  toolbarHelp: BehaviorSubject<boolean>;
  settings: Settings;
}

export interface StageStateExport {

}

export interface Settings {
  audioControl: AudioControl;
  keyboardNavigation: KeyboardNavigation;
}

export interface AudioControl {
  readAloudElements: BehaviorSubject<boolean>;
  speed: BehaviorSubject<AudioControlSpeed>;
}

export interface KeyboardNavigation {
  hint: BehaviorSubject<boolean>;
  keyBinding: BehaviorSubject<KeyboardNavigationKeyBinding>;
}

export enum AudioControlSpeed {
  slow, normal, fast
}

export enum KeyboardNavigationKeyBinding {
  nvda, jaws, voiceover
}
