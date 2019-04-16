/*
import { ChartAccent } from './chart-accent/chart-accent';
import { ChartInfo } from './chart-info/chart-info';

export function accentToInfo(ca: ChartAccent): [ChartInfo.ChartInfo, any[]] {
  ca.annotations.annotations.forEach((annotation, aid: number) => {
    if (!annotation.target_inherit) {
      if (annotation.target.type === 'items') {
        annotation.target.items.forEach(item => {
          const series = +(item.elements.slice(1)) - 2;
          const indices = item.items.map(dataindex => {
            return JSON.parse(dataindex)[2]
          });
          // maybe trendline
          if (indices.length === chartInfo.children[4].children.length) {
            annotation.components.forEach(component => {
              if (component.visible && component.type === 'trendline') {
                const trendlineItem = chartInfo.children[3].children[series];
                trendlineItem['_annotation'] = annotation;
                trendlineItem.trendline = true;
              }
            });
          } else {
            indices.forEach(index => {
              const bar = chartInfo.children[4].children[index].children[series]
              bar['_annotation'] = annotation;
              bar.highlighted = true;
            });
          }
        });
      } else if (annotation.target.type === 'range') {
        const axisName = annotation.target.axis === 'E0' ? 'x' : 'y';
        const axis = axisName === 'x' ? chartInfo.children[2] : chartInfo.children[1];
        // axis['_annotation'] = annotation;
        if (annotation.target.range.startsWith('range')) {
          const [rs, rf] = JSON.parse('[' + annotation.target.range.slice(6, -1).split(',').slice(0, 2).join(',') + ']');
          axis.ranges.push([rs, rf]);
          chartInfo.children[5].children.push({
            tagname: 'range',
            axis: axisName,
            rs: rs,
            rf: rf,
            _annotation: annotation
          });
        } else {
          axis.lines.push(annotation.target.range);
          chartInfo.children[5].children.push({
            tagname: 'line',
            axis: axisName,
            range: annotation.target.range,
            _annotation: annotation
          });
        }
      }
    } else {
      if (annotation.target.type === 'range') {
        const mode = annotation.target_inherit.mode;
        const serieses = annotation.target_inherit.serieses;
        const axisName = annotation.target.axis === 'E0' ? 'x' : 'y';
        const range = annotation.target.range;
        const [rs, rf] = JSON.parse('[' + range.slice(6,-1).split(',').slice(0,2).join(',') + ']')
        if (range.startsWith('range')) {
          chartInfo.children[5].children.push({
            tagname: 'relationalRange',
            axis: axisName,
            rs: rs,
            rf: rf,
            mode: mode,
            _annotation: annotation
          });
        } else {
          chartInfo.children[5].children.push({
            tagname: 'relationalLine',
            axis: axisName,
            range: range,
            mode: mode,
            _annotation: annotation
          });
        }
      }
    }
  });

  return [chartInfo, tags];
}
*/
