import { Component, OnInit } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { ChartDescription } from '../chart-structure/chart-description/chart-description';

@Component({
  selector: 'app-make-chart',
  templateUrl: './make-chart.component.html',
  styleUrls: ['./make-chart.component.scss']
})
export class MakeChartComponent implements OnInit {

  chartSpec: ChartSpec;
  chartDescription: ChartDescription;

  constructor() { }

  ngOnInit() {
    this.chartSpec = new ChartSpec();

    this.chartSpec.title.title.value = 'Honolulu';
    this.chartSpec.y.label.value = 'y label';
    this.chartSpec.y.unit.value = 'y unit';
    this.chartSpec.x.label.value = 'x label';
    this.chartSpec.x.unit.value = 'x unit';
    this.chartSpec.legend.addChild.value();
    this.chartSpec.legend.addChild.value();
    this.chartSpec.legend.items.value.forEach((item, i) => item.text.value = `Series ${i + 1}`);
    this.chartSpec.x.addChild.value();
    this.chartSpec.x.addChild.value();
    this.chartSpec.x.ticks.value.forEach((tick, i) => tick.text.value = `Group ${i + 1}`);
    this.chartSpec.marks.bargroups.value.forEach((bargroup, i) => {
      bargroup.bars.value.forEach((bar, j) => {
        bar.value.value =  2 * i + j + 1;
      });
    });

    this.chartDescription = new ChartDescription(this.chartSpec);
  }

}
