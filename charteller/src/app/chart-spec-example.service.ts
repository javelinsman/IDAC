import { Injectable } from '@angular/core';
import { ChartSpec } from './chart-structure/chart-spec/chart-spec';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartSpecExampleService {
  examples: ChartSpec[] = [];

  constructor() {
    this.examples.push(this.example1());
    this.examples.push(this.example2());
  }

  getExamples(): Observable<ChartSpec[]> {
    return of(this.examples);
  }

  example1() {
    const cs = new ChartSpec();
    cs.title.title.value = 'Net Income of Companies';
    cs.y.label.value = 'net income';
    cs.y.unit.value = 'billion dollars';
    cs.x.label.value = '';
    cs.x.unit.value = 'year';
    cs.legend.addChild.value();
    cs.legend.addChild.value();
    cs.legend.addChild.value();
    cs.legend.items.value.forEach((item, i) => item.text.value = `company ${'ABC'[i]}`);
    cs.x.addChild.value();
    cs.x.addChild.value();
    cs.x.addChild.value();
    cs.x.addChild.value();
    cs.x.addChild.value();
    cs.x.ticks.value.forEach((tick, i) => tick.text.value = `${i + 2012}`);
    const data = [
      [5.5, 4.6, 8.1],
      [5.8, 5.2, 6.8],
      [6.9, 6.8, 6.6],
      [7.6, 6.9, 5.1],
      [9.1, 7.1, 3.8],
    ];
    const inv = [
      [], [], [], [], []
    ];
    cs.marks.bargroups.value.forEach((bargroup, i) => {
      bargroup.bars.value.forEach((bar, j) => {
        bar.value.value =  data[i][j];
        inv[i].push(bar);
      });
    });
    cs.annotations.addHighlights.value();
    cs.annotations.highlights.value[0].target.value = new Set([inv[0][0], inv[0][2], inv[4][0], inv[4][2]]);
    return cs;
  }

  example2() {
    const cs = new ChartSpec();
    cs.title.title.value = 'Honolulu';
    cs.y.label.value = 'y label';
    cs.y.unit.value = 'y unit';
    cs.x.label.value = 'x label';
    cs.x.unit.value = 'x unit';
    cs.legend.addChild.value();
    cs.legend.addChild.value();
    cs.legend.items.value.forEach((item, i) => item.text.value = `Series ${i + 1}`);
    cs.x.addChild.value();
    cs.x.addChild.value();
    cs.x.ticks.value.forEach((tick, i) => tick.text.value = `Group ${i + 1}`);
    cs.marks.bargroups.value.forEach((bargroup, i) => {
      bargroup.bars.value.forEach((bar, j) => {
        bar.value.value =  2 * i + j + 1;
      });
    });
    cs.annotations.addHighlights.value();
    cs.annotations.addCoordinateLine.value();
    cs.annotations.addCoordinateRange.value();
    return cs;
  }

}
