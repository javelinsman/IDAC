import { Injectable } from '@angular/core';
import { ITouchObject, TouchCircle, TouchRectangle } from './touch-object';
import { SpeakingService } from './speaking.service';
import { beep } from 'src/utils';

@Injectable({
  providedIn: 'root'
})
export class TouchObjectService {

  constructor(private speakingService: SpeakingService) {
    this.speakingService.read('hello world');
    this.constructChart();
  }

  public touchObjects: ITouchObject[] = [
  ];

  makeCluster(cx, cy, r, n, pitch, name) {
    for (let i = 0; i < n; i++) {
      const x = Math.round((cx + Math.random() * r));
      const y = Math.round((cy + Math.random() * r));
      this.touchObjects.push(
        this.makeCircle(x, y, 20, {volume: 10, pitch: pitch, duration: 150}, {pattern: 50}, {text: `스트레스 ${y - 30} 우울 ${x - 30} ${name}`}),
      )
    }
  }

  constructChart() {
    for (let i = 0; i < 22; i++) {
      this.touchObjects.push(this.makeRect(20, 30 + 25 * i, 20, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `스트레스 ${25 * i}`}));
    }
    this.touchObjects.push(this.makeRect(30, 30, 10, 570, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'x축 막대: 스트레스'}));
    for (let i = 0; i < 13; i++) {
      this.touchObjects.push(this.makeRect(30 + 20 * i, 20, 10, 20, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `우울 ${20 * i}`}));
    }
    this.touchObjects.push(this.makeRect(30, 30, 270, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'y축 막대: 우울'}));
    this.makeCluster(150, 150, 50, 13, 420, '한국');
    this.makeCluster(100, 400, 30, 7, 640, '일본');

    // background
    this.touchObjects.push(
      this.makeRect(0, 0, 300, 600, null)
    )

  }

  private makeCircle(cx, cy, r, beepSpec = null, vibrationSpec = null, ttsSpec = null) {
    return new TouchCircle(beep, x => this.speakingService.read(x), cx, cy, r, beepSpec, vibrationSpec, ttsSpec);
  }

  private makeRect(x, y, w, h, beepSpec = null, vibrationSpec = null, ttsSpec = null) {
    return new TouchRectangle(beep, x => this.speakingService.read(x), x, y, w, h, beepSpec, vibrationSpec, ttsSpec);
  }
}
