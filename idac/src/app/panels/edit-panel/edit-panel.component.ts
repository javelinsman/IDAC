import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {

  @Input() tag: SpecTag;
  overrideDescription: boolean;

  constructor() { }

  ngOnInit() {
    this.overrideDescription = this.tag.editorsNote.active;
  }

}
