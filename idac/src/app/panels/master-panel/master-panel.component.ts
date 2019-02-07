import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-master-panel',
  templateUrl: './master-panel.component.html',
  styleUrls: ['./master-panel.component.scss']
})
export class MasterPanelComponent implements OnInit {

  @Input() tag: SpecTag;
  overrideDescription: boolean;

  constructor() { }

  ngOnInit() {
    this.overrideDescription = this.tag.editorsNote.active;
  }

}
