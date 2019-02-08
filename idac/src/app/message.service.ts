import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private keyboardSubject: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() { }

  private _shouldScroll = false;
  set shouldScroll(b: boolean) {
    this._shouldScroll = b;
  }
  get shouldScroll() {
    return this._shouldScroll;
  }

  get keyboardEventName() {
    return this.keyboardSubject.getValue();
  }

  set keyboardEventName(s: string) {
    this.keyboardSubject.next(s);
  }

  get keyboardEventNameObservable() {
    return this.keyboardSubject.asObservable();
  }

}
