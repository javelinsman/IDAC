import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { render } from './draw-chart';
import * as d3 from 'd3';

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
    this.renderChart();
    setInterval(() => this.renderChart(), 1000);

  }

  renderChart() {
    const svgId = `#chart-view-svg-${this.chartId}`;
    const drawSpec = this.makeDrawSpec();
    render(drawSpec, svgId);
  }

  makeDrawSpec() {
    const cs = this.chartSpec;
    const drawSpec = {
      meta: {
          title: cs.title.title.value,
          x_title: cs.x.label.value,
          x_unit: cs.x.unit.value,
          y_title: cs.y.label.value,
          y_unit: cs.y.unit.value,
          y_min: cs.y.rangeMin.value,
          y_max: cs.y.rangeMax.value,
          gridline: 'horizontal',
          colors: cs.legend.items.value.map((item, i) => {
            const itemName = item.text.value;
            const itemColor = d3.schemeCategory10[i];
            return { itemName, itemColor };
          }).reduce((accum, itemPair) => {
            accum[itemPair.itemName] = itemPair.itemColor;
            return accum;
          }, {}),
          x_tick_rotate: '30',
          // width: 700,
          // height: 400,
      },
      marks: cs.marks.bargroups.value.map(bargroup => {
        if (cs.marks.type.value === 'grouped') {
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
        } else {
          const marksSpec = {
            type: 'stacked_bar',
            key: bargroup.name.value.text.value,
            stacks: bargroup.bars.value.map(bar => {
              const stackSpec = {
                value: bar.value.value,
                color: {
                  name: bar.key.value.text.value
                }
              };
              return stackSpec;
            })
          };
          return marksSpec;
        }
      })
    };
    return drawSpec;
  }
}
