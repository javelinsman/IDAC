import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { Item } from './legend';

export class Highlight extends SpecTag {
    constructor(
        protected annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations | CoordinateRange
    ) {
        super('Highlight');
        this.attributes = {
            itemLabel: new AttrInputSelect(['on', 'off'], 'off'),
            highlight: new AttrInputSelect(['emphasize', 'de-emphasize', 'off'], 'off'),
            trendline: new AttrInputSelect(['on', 'off'], 'off'),
            label: new AttrInput()
        };
        this.properties = {
            targetDescription: () => '',
            numTargets: () => '',
            itemLabel: () => '',
            trendline: () => '',
            highlight: () => ''
        };
        this.descriptionRule = [
            'The annotation on $(numTargets) bar\'s on $(targetDescription).',
            '$(highlight)',
            '$(itemLabel)',
            '$(trendline)',
          ].join(' ');
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
        this.attributes.itemLabel.value = itemLabel.visible ? 'on' : 'off';
        const trendline = this.annotation.components.find(d => d.type === 'trendline');
        this.attributes.trendline.value = trendline.visible ? 'on' : 'off';
        const highlight = this.annotation.components.find(d => d.type === 'highlight');
        if (highlight.visible) {
            if (highlight.style.fill.value < 0 || highlight.style.stroke_width > 0) {
                this.attributes.highlight.value = 'emphasize';
            } else if (highlight.style.fill.value > 0 && highlight.style.stroke_width <= 0) {
                this.attributes.highlight.value = 'de-emphasize';
            } else {
                this.attributes.highlight.value = 'off';
            }
        } else {
            this.attributes.highlight.value = 'off';
        }
        const { target, numTargets } = this.makeTargetInfo();
        this.properties = {
            targetDescription: () => target,
            numTargets: () => numTargets,
            itemLabel: () => this.attributes.itemLabel.value === 'on'
                ? 'Item labels are marked on them.' : '',
            trendline: () => this.attributes.trendline.value === 'on'
                ? 'A trendline is drawn.' : '',
            highlight: () => {
                if (this.attributes.highlight.value === 'emphasize') {
                    return 'They are highlighted.';
                } else if (this.attributes.highlight.value === 'de-emphasize') {
                    return 'They are de-emphasized.';
                } else {
                    return '';
                }
            }
        };
    }

    getTargetLocation(): [Item, number[]][] {
        const locations = [];
        (this.annotation.target as ChartAccent.ItemsTarget).items.forEach(item => {
          const seriesIndex = +item.elements.slice(1) - 2;
          const borrowMarks = this._root.marks;
          const series = borrowMarks.children[0].children[seriesIndex];
          const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
          locations.push([series, indices]);
        });
        return locations;
    }

    makeTargetInfo() {
        const targets = [];
        let numTargets = 0;
        this.getTargetLocation().forEach(([series, indices]) => {
            const seriesName = series.properties.text();
            targets.push(`${indices.length === this._root.marks.children.length ?
                'all bars' : `${indices.map(i => i + 1).join(', ')}-th position`} in ${seriesName}`);
            numTargets += indices.length;
        });
        return {
            target: targets.join(', and '),
            numTargets
        };
      }

}
