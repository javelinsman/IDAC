export interface ITouchObject {
  beep: any;
  tts: any;
  notify: any;
  collide: any;
  beepSpec?: any;
  vibrationSpec?: any;
  ttsSpec?: any;
  [key: string]: any;
}

export class TouchCircle implements ITouchObject {
  type: string;
  style: any;
  constructor(
    public beep: any,
    public tts: any,
    public cx: number,
    public cy: number,
    public r: number,
    public beepSpec: any = null,
    public vibrationSpec: any = null,
    public ttsSpec: any = null,
  ) {
    this.type = 'circle';
    this.style = {
      fill: (this.beepSpec && this.beepSpec.pitch) ? 'black' : 'transparent'
    };
  }

  notify() {
    if (this.beepSpec) {
      this.beep(this.beepSpec.volume, this.beepSpec.pitch, this.beepSpec.duration);
    }
    if (this.vibrationSpec) {
      window.navigator.vibrate(this.vibrationSpec.pattern);
    }
    if (this.ttsSpec) {
      this.tts(this.ttsSpec.text);
    }
  }

  collide(x: number, y: number) {
    return Math.pow(this.cx - x, 2) + Math.pow(this.cy - y, 2) <= Math.pow(this.r, 2);
  }

}

export class TouchRectangle implements ITouchObject {
  type: string;
  style: any;
  constructor(
    public beep: any,
    public tts: any,
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public beepSpec: any,
    public vibrationSpec: any,
    public ttsSpec: any
  ) {
    this.type = 'rectangle';
    this.style = {
      fill: (this.beepSpec && this.beepSpec.pitch) ? 'black' : 'transparent'
    };
  }

  notify() {
    if (this.beepSpec) {
      this.beep(this.beepSpec.volume, this.beepSpec.pitch, this.beepSpec.duration);
    }
    if (this.vibrationSpec) {
      window.navigator.vibrate(this.vibrationSpec.pattern);
    }
    if (this.ttsSpec) {
      this.tts(this.ttsSpec.text);
    }
  }

  collide(x: number, y: number) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
  }
}
