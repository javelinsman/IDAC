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

  private shouldCollapseSubject = new BehaviorSubject(false);
  set shouldCollapse(b: boolean) {
    this.shouldCollapseSubject.next(b);
  }
  get shouldCollapse() {
    return this.shouldCollapseSubject.getValue();
  }
  get shouldCollapseObservable() {
    return this.shouldCollapseSubject.asObservable();
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
