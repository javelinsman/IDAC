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
