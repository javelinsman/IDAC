import { Component, OnInit } from '@angular/core';
import { Chart } from '../chart';
import { ChartExampleService } from '../chart-example.service';
import { HttpClient } from '@angular/common/http';

export enum Stage {
  load,
  describe,
  export
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  Stage = Stage;
  exampleId: number;
  currentStage = Stage.load;

  constructor(
  ) { }

  ngOnInit() {
  }

  _exampleIdChange(event) {
    this.exampleId = event;
    this.currentStage = Stage.describe;
  }

}
