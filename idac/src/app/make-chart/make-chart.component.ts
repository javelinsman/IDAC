import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { ChartDescription } from '../chart-structure/chart-description/chart-description';
import { NavigateComponent } from '../navigate/navigate.component';
import { ChartSpecExampleService } from '../chart-spec-example.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {

  chartSpec: ChartSpec;
  chartDescription: ChartDescription;
  isRendered = false;

  @ViewChild(NavigateComponent) NavigateComponent: NavigateComponent;

  constructor(
      private chartSpecExampleService: ChartSpecExampleService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {
    const exampleId = this.route.snapshot.paramMap.get('exampleId');
    if (exampleId) {
      this.chartSpecExampleService.getExamples()
        .subscribe(data => {
          this.chartSpec = data[+exampleId];
        });
    } else {
      this.chartSpec = new ChartSpec();
    }
  }

  render() {
    this.isRendered = true;
    this.chartDescription = new ChartDescription(this.chartSpec);
    this.NavigateComponent.info = this.chartDescription;
    this.NavigateComponent.ngOnInit();
  }

}
