import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spec-tree-view',
  templateUrl: './spec-tree-view.component.html',
  styleUrls: ['./spec-tree-view.component.scss']
})
export class SpecTreeViewComponent implements OnInit {

  @Input() tag: any;
  @Input() indent: number;

  constructor() { }

  ngOnInit() {
    if (!this.indent) {
      this.indent = 0;
    }
  }

}
