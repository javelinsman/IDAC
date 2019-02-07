import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { keyBindings } from '../key-bindings';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-keyboard-panel',
  templateUrl: './keyboard-panel.component.html',
  styleUrls: ['./keyboard-panel.component.scss']
})
export class KeyboardPanelComponent implements OnInit {
  keyBindings: any;
  currentKeyboardEventName = '';

  constructor(
    public messageService: MessageService
  ) { }

  ngOnInit() {
    this.keyBindings = Object.entries(keyBindings).map(d => ({
      key: d[0], value: d[1]
    }));
  }

}
