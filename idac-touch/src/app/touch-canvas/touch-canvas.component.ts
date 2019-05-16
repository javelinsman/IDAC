import { Component, OnInit } from '@angular/core';
import { copyTouch, colorForTouch, ongoingTouchIndexById, log } from 'src/utils';

@Component({
  selector: 'app-touch-canvas',
  templateUrl: './touch-canvas.component.html',
  styleUrls: ['./touch-canvas.component.scss']
})
export class TouchCanvasComponent implements OnInit {

  ongoingTouches = [];

  constructor() { }

  ngOnInit() {
    const el = document.getElementsByTagName('canvas')[0];
    el.addEventListener('touchstart', this.handleStart.bind(this), false);
    el.addEventListener('touchend', this.handleEnd.bind(this), false);
    el.addEventListener('touchcancel', this.handleCancel.bind(this), false);
    el.addEventListener('touchmove', this.handleMove.bind(this), false);
    console.log('initialized.');
  }

  handleStart(evt) {
    evt.preventDefault();
    console.log('touchstart.');
    const el = document.getElementsByTagName('canvas')[0];
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      console.log('touchstart:' + i + '...');
      this.ongoingTouches.push(copyTouch(touches[i]));
      const color = colorForTouch(touches[i]);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
      ctx.fillStyle = color;
      ctx.fill();
      console.log('touchstart:' + i + '.');
    }
  }

  handleEnd(evt) {
    evt.preventDefault();
    log('touchend');
    const el = document.getElementsByTagName('canvas')[0];
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      const idx = ongoingTouchIndexById(this.ongoingTouches, touches[i].identifier);

      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
        this.ongoingTouches.splice(idx, 1);  // remove it; we're done
      } else {
        console.log('can\'t figure out which touch to end');
      }
    }
  }

  handleCancel(evt) {
    evt.preventDefault();
    console.log('touchcancel.');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(this.ongoingTouches, touches[i].identifier);
      this.ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }

  handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementsByTagName('canvas')[0];
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      const idx = ongoingTouchIndexById(this.ongoingTouches, touches[i].identifier);

      if (idx >= 0) {
        console.log('continuing touch ' + idx);
        ctx.beginPath();
        console.log('ctx.moveTo(' + this.ongoingTouches[idx].pageX + ', ' + this.ongoingTouches[idx].pageY + ');');
        ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);
        console.log('ctx.lineTo(' + touches[i].pageX + ', ' + touches[i].pageY + ');');
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();

        this.ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        console.log('.');
      } else {
        console.log('can\'t figure out which touch to continue');
      }
    }
  }

}
