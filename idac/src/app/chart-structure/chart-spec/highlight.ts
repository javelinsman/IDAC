import * as ChartAccent from '../chart-accent/chart-accent';
import { SpecTag } from './spec-tag';
import { ChartSpec } from './chart-spec';
import { Annotations } from './annotations';
import { AttrInputSelect, AttrInput } from './attributes';

export class Highlight extends SpecTag {
    constructor(
        private annotation: ChartAccent.Annotation,
        public _root: ChartSpec,
        public _parent: Annotations
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
        const { target, numTargets } = this.makeTargetInfo(ca);
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

    makeTargetInfo(ca: ChartAccent.ChartAccent) {
        const targets = [];
        let numTargets = 0;
        (this.annotation.target as ChartAccent.ItemsTarget).items.forEach(item => {
          const series = +item.elements.slice(1) - 2;
          const borrowMarks = this._root.marks;
          const seriesName = borrowMarks.children[0].children[series].properties.seriesName();
          const indices = item.items.map(itemString => JSON.parse(itemString)[2]);
          targets.push(`${indices.length === borrowMarks.children.length ?
            'all bars' : `${indices.join(', ')}-th position`} in ${seriesName}`);
          numTargets += indices.length;
        });
        return {
            target: targets.join(', and '),
            numTargets
        };
      }

}
