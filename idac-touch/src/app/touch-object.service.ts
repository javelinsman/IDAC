import { Injectable } from '@angular/core';
import { ITouchObject, TouchCircle, TouchRectangle, TouchLine } from './touch-object';
import { SpeakingService } from './speaking.service';
import { beep } from 'src/utils';

@Injectable({
  providedIn: 'root'
})
export class TouchObjectService {

  constructor(private speakingService: SpeakingService) {
  }

  public getTouchObjects(exampleId: number) {
    const touchObjects = [];
    const push = (x: ITouchObject) => touchObjects.push(x);
    if (exampleId === 1) {
      push(this.makeCircle(110, 230, 10, {volume: 10, pitch: 500, duration: 150}, {pattern: 50}, {text: '좌표 5 컴마 2에 있는 점'}));
      push(this.makeLine(30, 230, 110, 230, {volume: 10, pitch: 200, duration: 150}, {pattern: [25, 25, 25]}, {text: '세로 점선'}));
      push(this.makeLine(110, 20, 110, 230, {volume: 10, pitch: 200, duration: 150}, {pattern: [25, 25, 25]}, {text: '가로 점선'}));
      for (let i = 0; i < 11; i++) {
        push(this.makeRect(20, 30 + 50 * i, 30, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `x축 좌표: ${i}`}));
      }
      push(this.makeRect(30, 30, 10, 530, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'x축 막대'}));
      for (let i = 0; i < 7; i++) {
        push(this.makeRect(30 + 40 * i, 20, 10, 30, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `y축 좌표: ${i}`}));
      }
      push(this.makeRect(30, 30, 270, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'y축 막대'}));
    } else {
      for (let i = 0; i < 22; i++) {
        push(this.makeRect(20, 30 + 25 * i, 20, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `소득 ${25 * i}천원`}));
      }
      push(this.makeRect(30, 30, 10, 570, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'x축 막대: 소득'}));
      for (let i = 0; i < 13; i++) {
        push(this.makeRect(30 + 20 * i, 20, 10, 20, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: `사교육비 ${20 * i}만원`}));
      }
      push(this.makeRect(30, 30, 270, 10, {volume: 10, pitch: 300, duration: 150}, {pattern: 50}, {text: 'y축 막대: 사교육비'}));
      // this.makeCluster(220, 480, 30, 25, 523, '부자고등학교');
      // this.makeCluster(70, 410, 20, 15, 784, '기숙사고등학교');
      // this.makeCluster(100, 200, 50, 40, 440, '일반고등학교');
      push(this.makeLine(0, 0, 300, 200, {volume: 10, pitch: 500, duration: 150}, {pattern: 100}, {text: `막대기입니다 하하`}));
      // background
    }

    push(
      this.makeRect(0, 0, 300, 600, null)
    );

    return touchObjects;
  }


  /*
  makeCluster(cx, cy, r, n, pitch, name) {
    for (let i = 0; i < n; i++) {
      const x = Math.round((cx + Math.random() * r));
      const y = Math.round((cy + Math.random() * r));
      this.touchObjects.push(
        this.makeCircle(x, y, 20, {volume: 10, pitch: pitch, duration: 150}, {pattern: 50}, {text: `소득 ${y - 30}천원 사교육비 ${x - 30}만원 ${name}`}),
      )
    }
  }
  */

  private makeCircle(cx, cy, r, beepSpec = null, vibrationSpec = null, ttsSpec = null) {
    return new TouchCircle(beep, x => this.speakingService.read(x), cx, cy, r, beepSpec, vibrationSpec, ttsSpec);
  }

  private makeRect(x, y, w, h, beepSpec = null, vibrationSpec = null, ttsSpec = null) {
    return new TouchRectangle(beep, x => this.speakingService.read(x), x, y, w, h, beepSpec, vibrationSpec, ttsSpec);
  }
  private makeLine(x1, y1, x2, y2, beepSpec = null, vibrationSpec = null, ttsSpec = null) {
    return new TouchLine(beep, x => this.speakingService.read(x), x1, y1, x2, y2, beepSpec, vibrationSpec, ttsSpec);
  }
}
