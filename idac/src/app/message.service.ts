import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private _shouldScroll = false;
  set shouldScroll(b: boolean) {
    this._shouldScroll = b;
  }
  get shouldScroll() {
    return this._shouldScroll;
  }

}
