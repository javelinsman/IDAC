import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';
import { CoordinateRange } from './coordinate-range';
import { Item } from './legend';
import { CoordinateLine } from './coordinate-line';

export class Highlight extends SpecTag {
    constructor(
        public annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations | CoordinateRange | CoordinateLine
    ) {
        super('Highlight');
        this.attributes = {
            itemLabel: new AttrInputSelect(['on', 'off'], 'off'),
            highlight: new AttrInputSelect(['emphasize', 'de-emphasize', 'off'], 'off'),
            label: new AttrInput()
        };
        this.properties = {
            targetDescription: () => '',
            numTargets: () => '',
            itemLabel: () => '',
            highlight: () => ''
        };
        this.descriptionRule = [
            '$(numTargets) bars are annotated, labeled as "$(label)".',
            '$(highlight)',
            '$(itemLabel)',
            'Specifically, targets are $(targetDescription).'
        ].join(' ');
    }

    fromChartAccent(ca: ChartAccent.ChartAccent) {
        const itemLabel = this.annotation.components.find(d => d.type === 'item-label');
        this.attributes.itemLabel.value = itemLabel.visible ? 'on' : 'off';
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
            ...this.properties,
            targetDescription: () => target,
            numTargets: () => numTargets,
            itemLabel: () => this.attributes.itemLabel.value === 'on'
                ? 'Item labels are marked on them.' : '',
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
          const series = this._root.legend.children[seriesIndex];
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
                'all bars' : `${indices.map(i => i + 1).join(', ')}-th bar`} in ${seriesName}`);
            numTargets += indices.length;
        });
        return {
            target: targets.join(', and '),
            numTargets
        };
      }

}
