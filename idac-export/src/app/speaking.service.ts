import { Injectable } from '@angular/core';
import { StageStateService } from './stage-state.service';
import { AudioControlSpeed } from './stage-state';
import { SpecTag } from './chart-structure/chart-spec/spec-tag';

@Injectable({
  providedIn: 'root'
})
export class SpeakingService {

  private speed: AudioControlSpeed;
  private audioContext: AudioContext;
  private sayTimeout;

  public speak: boolean;
  public tagReading: SpecTag;

  private queueSignature: number = 0;
  private utteranceQueue: SpeechSynthesisUtterance[] = [];

  timestamp: number;

  constructor(private stageStateService: StageStateService) {
    this.stageStateService.readAloudElementsObservable.subscribe(speak => {
      this.speak = speak;
    });
    this.stageStateService.speedObservable.subscribe(speed => {
      this.speed = speed;
    });
    this.audioContext = new AudioContext();
  }

  read(message: string, tag: SpecTag = null) {
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

  private _makeUtterance(sentence: string) {
    const utt = new SpeechSynthesisUtterance(sentence);
    utt.lang = 'en-GB';
    if (this.speed === AudioControlSpeed.slow) {
      utt.rate = 0.5;
    } else if (this.speed === AudioControlSpeed.normal) {
      utt.rate = 1;
    } else {
      utt.rate = 1.5;
    }
    utt.volume = 1;
    return utt;
  }

  private _read(message: string) {
    const timestamp = Date.now();
    this.timestamp = timestamp;
    this.stop();
    setTimeout(() => {
      if (this.timestamp !== timestamp) { return; }
      const utts = message.split(';').map(sentence => this._makeUtterance(sentence));
      const sig = ++ this.queueSignature;
      this._speakUtterances(utts, sig);
    }, 250);
  }

  private _speakUtterances(utterances: SpeechSynthesisUtterance[], signature: number) {
    if (signature != this.queueSignature) { return; }
    if (!utterances.length) { return; }
    const utt = utterances[0];
    const remainingUtts = utterances.slice(1);
    window.speechSynthesis.speak(utt);
    utt.onend = () => {
      this._speakUtterances(remainingUtts, signature);
    }
  }

}
