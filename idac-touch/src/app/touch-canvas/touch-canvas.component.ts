import { Component, OnInit, Input } from '@angular/core';
import { copyTouch, colorForTouch, ongoingTouchIndexById, log } from 'src/utils';
import { TouchObjectService } from '../touch-object.service';
import { ITouchObject } from '../touch-object';
import * as d3 from 'd3';

@Component({
  selector: 'app-touch-canvas',
  templateUrl: './touch-canvas.component.html',
  styleUrls: ['./touch-canvas.component.scss']
})
export class TouchCanvasComponent implements OnInit {

  @Input() exampleId: number = 0;

  ongoingTouches = [];

  constructor(
    private touchObjectService: TouchObjectService
  ) { }

  private touchObjects: ITouchObject[];
  private touchingObjectIndex = -1;
  private lastTouchedTimestamp = -1;

  ngOnInit() {
    const el = document.getElementsByTagName('canvas')[0];
    el.addEventListener('touchstart', this.handleStart.bind(this), false);
    el.addEventListener('touchend', this.handleEnd.bind(this), false);
    el.addEventListener('touchcancel', this.handleCancel.bind(this), false);
    el.addEventListener('touchmove', this.handleMove.bind(this), false);
    console.log('initialized.');

    const canvas = d3.select('svg');

    this.touchObjects = this.touchObjectService.getTouchObjects(this.exampleId);
    console.log(this.touchObjects);
    this.touchObjects.reverse();
    this.touchObjects.forEach(touchObject => {
      if (touchObject.type === 'circle') {
        canvas.append('circle').attr('cx', touchObject.cx).attr('cy', touchObject.cy).attr('r', touchObject.r)
          .style('fill', touchObject.style.fill);
      } else if (touchObject.type === 'rectangle') {
        canvas.append('rect').attr('x', touchObject.x).attr('y', touchObject.y).attr('width', touchObject.w).attr('height', touchObject.h)
          .style('fill', touchObject.style.fill);
      } else if (touchObject.type === 'line') {
        canvas.append('line')
          .attr('x1', touchObject.x1).attr('y1', touchObject.y1)
          .attr('x2', touchObject.x2).attr('y2', touchObject.y2)
          .style('stroke', touchObject.style.fill)
          .style('stroke-width', 6);
      }
    });
    this.touchObjects.reverse();
  }

  handleTouchObjects(x: number, y: number) {
    for (const touchObj of this.touchObjects) {
      if (touchObj.collide(x, y)) {
        const idx = this.touchObjects.indexOf(touchObj);
        if (this.touchingObjectIndex !== idx && this.lastTouchedTimestamp + 100 < Date.now()) {
          this.touchingObjectIndex = idx;
          this.lastTouchedTimestamp = Date.now();
          touchObj.notify();
          log(idx + 'notify');
        }
        break;
      }
    }
  }

  handleStart(evt) {
    evt.preventDefault();
    console.log('touchstart.');
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      this.ongoingTouches.push(copyTouch(touches[i]));
    }
    this.handleMove(evt);
    /*
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
    */
  }

  handleEnd(evt) {
    evt.preventDefault();
    log('touchend');
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(this.ongoingTouches, touches[i].identifier);
      this.ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
    /*
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
    */
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
        const touchX = touches[i].pageX;
        const touchY = touches[i].pageY;
        this.handleTouchObjects(touchX, touchY);

        /*
        ctx.beginPath();
        console.log('ctx.moveTo(' + this.ongoingTouches[idx].pageX + ', ' + this.ongoingTouches[idx].pageY + ');');
        ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);
        console.log('ctx.lineTo(' + touches[i].pageX + ', ' + touches[i].pageY + ');');
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
        */

        this.ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        console.log('.');
      } else {
        console.log('can\'t figure out which touch to continue');
      }
    }
  }

}
