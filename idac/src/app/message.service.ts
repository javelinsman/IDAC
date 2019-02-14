import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private shouldScrollSubject = new BehaviorSubject(false);
  set shouldScroll(b: boolean) {
    this.shouldScrollSubject.next(b);
  }
  get shouldScroll() {
    return this.shouldScrollSubject.getValue();
  }
  get shouldScrollObservable() {
    return this.shouldScrollSubject.asObservable();
  }

  private keyboardSubject: BehaviorSubject<string> = new BehaviorSubject('');
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
