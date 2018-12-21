import { ChartAccentJSON } from "./chart_accent_json";
import { ChartInfo } from './chart_info';

export function accentToInfo(ca: ChartAccentJSON): [ChartInfo, any[]] {
  let chartInfo: ChartInfo;
  chartInfo = {
    tagname: 'graph',
    children: [
      {
        tagname: 'title',
        title: ca.chart.title.text
      },
      {
        tagname: 'y',
        min: ca.chart.yScale.min,
        max: ca.chart.yScale.max,
        label: ca.chart.yLabel.text.split('(')[0].trim(),
        unit: ca.chart.yLabel.text.split('(')
          .slice(1).join('(').slice(0,-1).split(':').slice(1).join(':').trim(),
        lines: [],
        ranges: [],
      },
      {
        tagname: 'x',
        label: ca.chart.xLabel.text,
        children: ca.dataset.rows.map(row => ({
          tagname: 'tick',
          tick: row[ca.dataset.columns[0].name]
        })),
        lines: [],
        ranges: []
      },
      {
        tagname: 'legend',
        children: ca.chart.yColumns.map(item => ({
          tagname: 'item',
          item: item,
          trendline: false
        }))
      },
      {
        tagname: 'marks',
        children: ca.dataset.rows.map(row => {
          return {
            tagname: 'bargroup',
            name: row[ca.dataset.columns[0].name],
            children: ca.dataset.columns.slice(1).map(column => column.name)
              .map(key => ({
                tagname: 'bar',
                key: key,
                value: row[key],
                relationalRanges: [],
                highlighted: false
              })),
            relationalRanges: []
          }
        })
      },
      {
        tagname: 'annotations',
        children: []
      }
    ]
  }

  ca.annotations.annotations.forEach((annotation, aid: number) => {
    if(!annotation.target_inherit){
      if(annotation.target.type === "items"){
        annotation.target.items.forEach(item => {
          let series = +(item.elements.slice(1)) - 2;
          let indices = item.items.map(dataindex => {
            return JSON.parse(dataindex)[2]
          })
          // maybe trendline
          if(indices.length == chartInfo.children[4].children.length){
            annotation.components.forEach(component => {
              if(component.visible && component.type == 'trendline'){
                let trendlineItem = chartInfo.children[3].children[series]
                trendlineItem['_annotation'] = annotation;
                trendlineItem.trendline = true;
              }
            })
          }
          else{
            indices.forEach(index => {
              let bar = chartInfo.children[4].children[index].children[series]
              bar['_annotation'] = annotation;
              bar.highlighted = true;
            })
          }
        });
      }
      else if(annotation.target.type === "range"){
        let axisName = annotation.target.axis === "E0" ? 'x' : 'y';
        let axis = axisName === 'x' ? chartInfo.children[2] : chartInfo.children[1];
        //axis['_annotation'] = annotation;
        if(annotation.target.range.startsWith('range')){
          let [rs, rf] = JSON.parse('[' + annotation.target.range.slice(6,-1).split(',').slice(0,2).join(',') + ']')
          axis.ranges.push([rs, rf])
          chartInfo.children[5].children.push({
            tagname: 'range',
            axis: axisName,
            rs: rs,
            rf: rf,
            _annotation: annotation
          })
        }
        else{
          axis.lines.push(annotation.target.range)
          chartInfo.children[5].children.push({
            tagname: 'line',
            axis: axisName,
            range: annotation.target.range,
            _annotation: annotation
          })
        }
      }
    }
    else{
      if(annotation.target.type == 'range'){
        let mode = annotation.target_inherit.mode;
        let serieses = annotation.target_inherit.serieses;
        let axisName = annotation.target.axis === "E0" ? 'x' : 'y';
        let range = annotation.target.range;
        let [rs, rf] = JSON.parse('[' + range.slice(6,-1).split(',').slice(0,2).join(',') + ']')
        if(range.startsWith('range')){
          chartInfo.children[5].children.push({
            tagname: 'relationalRange',
            axis: axisName,
            rs: rs,
            rf: rf,
            mode: mode,
            _annotation: annotation
          })
        }
        else{
          chartInfo.children[5].children.push({
            tagname: 'relationalLine',
            axis: axisName,
            range: range,
            mode: mode,
            _annotation: annotation
          })
        }
      }
    }
  })

  let idCount = 0;
  let tags = []
  function assignId(tag){
    tag['_id'] = idCount++;
    tags.push(tag);
    if(tag['children']){
      tag['children'].forEach(childTag =>{
        childTag['parentId'] = tag['_id']
        assignId(childTag)
      })
    }
  }
  assignId(chartInfo)

  return [chartInfo, tags]
}