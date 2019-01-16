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
    cs.title.title.value = 'Suicide Rate among OECD Countries';
    cs.y.label.value = 'people';
    cs.y.unit.value = 'per 0.1 million';
    cs.x.label.value = '';
    cs.x.unit.value = '';
    cs.legend.addChild.value();
    cs.legend.items.value[0].text.value = 'Suicide Rate';
    for (let _ = 0; _ < 12; _++) {
      cs.x.addChild.value();
    }
    const countries = [
      'Korea', 'Japan', 'Slovenia', 'Hungary', 'Belgium',
      'Poland', 'Findland', 'Czech', 'New Zealand', 'Austrailia',
      'Sweden', 'Denmark'
    ];
    cs.x.ticks.value.forEach((tick, i) => tick.text.value = `${countries[i]}`);
    const data = [
      25.8, 18.3, 18.2, 17.6, 16.3, 14.3, 13.6, 13.1,
      12.7, 12.5, 11, 10.3
    ];
    cs.marks.bargroups.value.forEach((bargroup, i) => {
      bargroup.bars.value[0].value.value = data[i];
    });
    cs.annotations.addHighlights.value();
    cs.annotations.addCoordinateLine.value();
    cs.annotations.highlights.value[0].target.value = new Set([cs.marks.bargroups.value[0].bars.value[0]]);
    const at = cs.annotations.coordinateLines.value[0];
    at.range.value = 13;
    at.label.value = 'Average: 13';
    at.addRelationalHighlight.value();
    at.relationalHighlights.value[0].mode.value = 'above';
    at.relationalHighlights.value[0].itemLabel.value = 'off';
    return cs;
  }

}
