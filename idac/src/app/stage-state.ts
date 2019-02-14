export interface StageState {
  load: StageStateLoad;
  describe: StageStateDescribe;
  export: StageStateExport;
}

export type StageStateLoad = any;

export interface StageStateDescribe {
  toolbarSetting: boolean;
  toolbarHelp: boolean;
  settings: Settings
}

export type StageStateExport = any;

export interface Settings {
  audioControl: AudioControl,
  keyboardNavigation: KeyboardNavigation
}

export interface AudioControl {
  readAloudElements: boolean,
  speed: AudioControlSpeed
}

export interface KeyboardNavigation {
  hint: boolean,
  keyBinding: KeyboardNavigationKeyBinding
}

export enum AudioControlSpeed {
  slow, normal, fast
}

export enum KeyboardNavigationKeyBinding {
  nvda, jaws, voiceover
}

export const defaultStageState: StageState =  {
  load: {},
  describe: {
    toolbarSetting: false,
    toolbarHelp: false,
    settings: {
      audioControl: {
        readAloudElements: true,
        speed: AudioControlSpeed.normal,
      },
      keyboardNavigation: {
        hint: true,
        keyBinding: KeyboardNavigationKeyBinding.nvda
      }
    }
  },
  export: {}
}
