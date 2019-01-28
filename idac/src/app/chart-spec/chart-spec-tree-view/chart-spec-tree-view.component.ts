import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-spec-tree-view',
  templateUrl: './chart-spec-tree-view.component.html',
  styleUrls: ['./chart-spec-tree-view.component.scss']
})
export class ChartSpecTreeViewComponent implements OnInit {

  @Input() tag: any;
  @Input() indent: number;

  constructor() { }

  ngOnInit() {
    if (!this.indent) {
      this.indent = 0;
    }
  }

}
