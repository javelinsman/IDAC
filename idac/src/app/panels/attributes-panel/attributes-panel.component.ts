import { Component, OnInit, Input } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-attributes-panel',
  templateUrl: './attributes-panel.component.html',
  styleUrls: ['./attributes-panel.component.scss']
})
export class AttributesPanelComponent implements OnInit {

  @Input() tag: SpecTag;

  constructor() { }

  ngOnInit() {
  }

}
