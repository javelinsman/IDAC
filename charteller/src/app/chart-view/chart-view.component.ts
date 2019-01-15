import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { render } from './draw-chart';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit, AfterViewInit {
  static chartId = 0;
  @Input() chartSpec: ChartSpec;
  chartId: number;

  constructor() { }

  ngOnInit() {
    this.chartId = ChartViewComponent.chartId ++;
  }

  ngAfterViewInit() {
    const svgId = `#chart-view-svg-${this.chartId}`;
    const drawSpec = this.makeDrawSpec();
    render(drawSpec, svgId);
    setInterval(() => {
      render(drawSpec, svgId);
    }, 1000);
  }

  makeDrawSpec() {
    const cs = this.chartSpec;
    const drawSpec = {
      meta: {
          title: cs.title.title.value,
          x_title: cs.x.label.value,
          y_title: cs.y.label.value,
          gridline: 'horizontal',
          colors: cs.legend.items.value.map((item, i) => {
            const itemName = item.text.value;
            const itemColor = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'][i];
            return { itemName, itemColor };
          }).reduce((accum, itemPair) => {
            accum[itemPair.itemName] = itemPair.itemColor;
            return accum;
          }, {}),
          x_tick_rotate: '30',
          width: 700,
          height: 300,
      },
      marks: cs.marks.bargroups.value.map(bargroup => {
        const marksSpec = {
          type: 'grouped_bar',
          key: bargroup.name.value.text.value,
          groups: bargroup.bars.value.map(bar => {
            const barSpec = {
              type: 'bar',
              bar: {
                value: bar.value.value,
                color: {
                  name: bar.key.value.text.value
                }
              }
            };
            return barSpec;
          })
        };
        return marksSpec;
      })
    };
    return drawSpec;
  }
}
