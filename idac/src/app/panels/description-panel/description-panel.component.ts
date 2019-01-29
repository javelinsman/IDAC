import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit {

  @Input() tag: SpecTag;

  constructor() { }

  ngOnInit() {
  }

}
