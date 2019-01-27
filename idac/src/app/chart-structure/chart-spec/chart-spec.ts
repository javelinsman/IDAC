import { ChartAccent } from '../chart-accent/chart-accent';
import { Title } from './title';
import { Y } from './y';
import { X } from './x';
import { Legend } from './legend';
import { Marks } from './marks';
import { Annotations } from './annotations';

export class ChartSpec {
    title = new Title(this);
    y = new Y(this);
    x = new X(this);
    legend = new Legend(this);
    marks = new Marks(this);
    annotations = new Annotations(this);

    fromChartAccent(ca: ChartAccent) {
        this.title.fromChartAccent(ca);
        this.y.fromChartAccent(ca);
        this.x.fromChartAccent(ca);
        this.legend.fromChartAccent(ca);
        this.marks.fromChartAccent(ca);
        this.annotations.fromChartAccent(ca);
    }

    update() {
    /*
        const ticks = this.x.ticks.value;
        const items = this.legend.items.value;
        const prev_values = {};
        this.marks.bargroups.value.forEach(bargroup => {
            const tick = bargroup.name.value.text.value;
            prev_values[tick] = {};
            bargroup.bars.value.forEach(bar => {
                const item = bar.key.value.text.value;
                prev_values[tick][item] = bar.value.value;
            });
        });
        this.marks.bargroups = {
            type: 'children',
            value: ticks.map(tick => {
                const bargroup = new Bargroup(this, this.marks);
                bargroup.name.value = tick;
                bargroup.bars = {
                    type: 'children',
                    value: items.map(item => {
                        const bar = new Bar(this, bargroup);
                        bar.key.value = item;
                        if (prev_values[tick.text.value] && prev_values[tick.text.value][item.text.value]) {
                            bar.value.value = prev_values[tick.text.value][item.text.value];
                        } else {
                            bar.value.value = 0;
                        }
                        return bar;
                    })
                };
                return bargroup;
            })
        };
    */
    }
}
