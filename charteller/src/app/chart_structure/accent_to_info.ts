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
          .slice(1).join('(').slice(0,-1).split(':').slice(1).join(':').trim()
      },
      {
        tagname: 'x',
        label: ca.chart.xLabel.text,
        children: ca.dataset.rows.map(row => ({
          tagname: 'tick',
          tick: row[ca.dataset.columns[0].name]
        }))
      },
      {
        tagname: 'legend',
        children: ca.chart.yColumns.map(item => ({
          tagname: 'item',
          item: item
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
                value: row[key]
              }))
          }
        })
      }
    ]
  }

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

  ca.annotations.annotations.forEach((annotation, aid: number) => {
    if(!annotation.target_inherit){
      if(annotation.target.type === "items"){
        annotation.target.items.forEach(item => {
          let series = +(item.elements.slice(1)) - 2;
          let indices = item.items.map(dataindex => {
            return JSON.parse(dataindex)[2]
          })
          if(indices.length == chartInfo.children[4].children.length){
            chartInfo.children[3].children[series]['_annotation'] = annotation;
          }
          else{
            indices.forEach(index => {
              let bar = chartInfo.children[4].children[index].children[series]
              bar['_annotation'] = annotation;
            })
          }
        });
      }
      else if(annotation.target.type === "range"){
        let axisName = annotation.target.axis === "E0" ? 'x' : 'y';
        let axis = chartInfo.children.find(tag => tag.tagname === axisName);
        axis['_annotation'] = annotation;
      }
    }
    else{
      if(annotation.target.type == 'range'){
        let mode = annotation.target_inherit.mode;
        let serieses = annotation.target_inherit.serieses;
        if(mode === "below"){
          let range = +annotation.target.range;
          serieses.forEach(seriesName => {
            let series = +(seriesName.slice(1)) - 2;
            chartInfo.children[4].children.forEach(bargroup => {
              if(bargroup.children[series].value < range){
                bargroup.children[series]['_annotation'] = annotation;
              }
            })
          })
        }
      }
    }
  })
  return [chartInfo, tags]
}