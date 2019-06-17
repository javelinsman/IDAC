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
        this.makeCircle(x, y, 20, {volume: 10, pitch: pitch, duration: 150}, {pattern: 50}, {text: `소득 ${y - 30}천원 사교육비 ${x - 30}만원 ${name}`}),
      )
    }
  }

  constructChart() {
    for (let i = 0; i < 22; i++) {
      this.touchObjects.push(this.makeRect(20, 30 + 25 * i, 20, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `소득 ${25 * i}천원`}));
    }
    this.touchObjects.push(this.makeRect(30, 30, 10, 570, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'x축 막대: 소득'}));
    for (let i = 0; i < 13; i++) {
      this.touchObjects.push(this.makeRect(30 + 20 * i, 20, 10, 20, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `사교육비 ${20 * i}만원`}));
    }
    this.touchObjects.push(this.makeRect(30, 30, 270, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'y축 막대: 사교육비'}));
    this.makeCluster(220, 480, 30, 25, 523, '부자고등학교');
    this.makeCluster(70, 410, 20, 15, 784, '기숙사고등학교');
    this.makeCluster(100, 200, 50, 40, 440, '일반고등학교');

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
