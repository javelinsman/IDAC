import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { eqSet } from '../utils';
import { keyBindings } from './key-bindings';

@Component({
  selector: 'app-keyboard-input',
  templateUrl: './keyboard-input.component.html',
  styleUrls: ['./keyboard-input.component.scss']
})
export class KeyboardInputComponent implements OnInit {

  @Output() keyFire: EventEmitter<any> = new EventEmitter();

  keydowns: Set<string>;
  keyBindings = keyBindings;
  currentKeybinding: Set<string>;
  currentEventName: string;

  constructor() { }

  ngOnInit() {
    this.keydowns = new Set();
    this.attachKeyboardListener();
  }

  attachKeyboardListener() {
    const _this = this;
    function keyboardListener(eventObject, key, event) {
      if (['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) {
        if (key === 'escape') {
          eventObject.preventDefault();
          (document.activeElement as any).blur();
        }
        return;
      } else if (!_this.isReservedKey(key)) {
        return;
      }
      eventObject.preventDefault();
      if (event === 'down') {
        _this.keydowns.add(key);
      } else if (event === 'up') {
        _this.detectKeyFire();
        _this.keydowns.delete(key);
        if (key === 'shift' || key === 'q') {
          _this.keydowns.clear();
        }
      }
    }
    document.addEventListener('keydown', function(e) {
        keyboardListener(event, e.key.toLowerCase(), 'down');
    });
    document.addEventListener('keyup', function(e) {
      keyboardListener(event, e.key.toLowerCase(), 'up');
    });
  }

  detectKeyFire() {
    for (const [eventName, keyBinding] of Object.entries(this.keyBindings)) {
      if (eqSet(this.keydowns, keyBinding)) {
        this.currentEventName = eventName;
        this.currentKeybinding = keyBinding;
        this.keyFire.emit(eventName);
        return;
      }
    }
  }

  isReservedKey(key: string): boolean {
    for (const keyBinding of Object.values(this.keyBindings)) {
      if (keyBinding.has(key)) {
        return true;
      }
    }
  }

}
