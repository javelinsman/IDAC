import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Stage } from '../index/index.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  Stage = Stage;
  @Input() stage: Stage;
  @Output() stageChange: EventEmitter<Stage> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
