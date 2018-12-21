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

  constructor() { }

  ngOnInit() {
    this.keydowns = new Set();
    this.attachKeyboardListener()
  }

  attachKeyboardListener(){
    const _this = this;
    function keyboardListener(eventObject, key, event){
      if(!_this.isReservedKey(key)) return;
      eventObject.preventDefault();
      if(event === 'down') _this.keydowns.add(key);
      if(event ==='up'){
        _this.detectKeyFire();
        _this.keydowns.delete(key);
      }
    }
    document.addEventListener('keydown', function(e){
        keyboardListener(event, e.key.toLowerCase(), 'down');
    });
    document.addEventListener('keyup', function(e){
      keyboardListener(event, e.key.toLowerCase(), 'up')
    });
  }

  detectKeyFire(){
    for(let [eventName, keyBinding] of Object.entries(this.keyBindings)){
      if(eqSet(this.keydowns, keyBinding)){
        this.keyFire.emit(eventName);
        return 
      }
    }
  }

  isReservedKey(key: string): boolean {
    for(let keyBinding of Object.values(this.keyBindings)){
      if(keyBinding.has(key)){
        return true;
      }
    }
  }

}
