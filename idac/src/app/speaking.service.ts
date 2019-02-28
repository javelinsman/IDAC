import { Injectable } from '@angular/core';
import { StageStateService } from './stage-state.service';
import { AudioControlSpeed } from './stage-state';
import { SpecTag } from './chart-structure/chart-spec/spec-tag';

@Injectable({
  providedIn: 'root'
})
export class SpeakingService {

  private speak: boolean;
  private speed: AudioControlSpeed;
  private audioContext: AudioContext;
  private sayTimeout;

  public tagReading: SpecTag;

  constructor(private stageStateService: StageStateService) {
    this.stageStateService.readAloudElementsObservable.subscribe(speak => {
      this.speak = speak;
    });
    this.stageStateService.speedObservable.subscribe(speed => {
      this.speed = speed;
    })
    this.audioContext = new AudioContext();
  }

  read(message: string, tag: SpecTag = null){
    if (this.speak) {
      this._read(message);
      this.tagReading = tag;
    }
  }

  get isSpeaking() {
    return speechSynthesis.speaking;
  }

  stop() {
    speechSynthesis.cancel();
  }

  private beep(volume: number, frequency: number, duration: number) {
    const v = this.audioContext.createOscillator();
    const u = this.audioContext.createGain();
    v.connect(u);
    v.frequency.value = frequency;
    v.type = 'square';
    u.connect(this.audioContext.destination);
    u.gain.value = volume * 0.01;
    v.start(this.audioContext.currentTime);
    v.stop(this.audioContext.currentTime + duration * 0.001);
  }

  beep_error() {
    this.beep(5, 700, 150);
  }

  beep_detect() {
    this.beep(5, 350, 150);
  }

  private _read(message, korean = false) {
    if (this.isSpeaking) {
      this.stop()
      // Make sure we don't create more than one timeout...
      if (this.sayTimeout !== null) {
          clearTimeout(this.sayTimeout);
      }
      this.sayTimeout = setTimeout(() => this._read(message, korean), 250);
    } else {
      const msg = new SpeechSynthesisUtterance(message);
      if (korean) {
        msg.lang = 'ko-KR';
      } else {
        msg.lang = 'en-US';
      }
      if (this.speed == AudioControlSpeed.slow) {
        msg.rate = 0.5;
      } else if (this.speed == AudioControlSpeed.normal) {
        msg.rate = 1;
      } else {
        msg.rate = 1.5;
      }

      window.speechSynthesis.speak(msg);
    }
  }

}
