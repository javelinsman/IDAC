import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-editors-note-panel',
  templateUrl: './editors-note-panel.component.html',
  styleUrls: ['./editors-note-panel.component.scss']
})
export class EditorsNotePanelComponent implements OnInit {

  @Input() tag: SpecTag;

  constructor() { }

  ngOnInit() {
  }

}
