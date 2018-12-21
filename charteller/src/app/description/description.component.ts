import { Component, OnInit, Input } from '@angular/core';
import { ChartInfo } from '../chart_structure/chart_info';
import { $ } from 'protractor';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  @Input() info: ChartInfo;
  @Input() tags: any[];
  @Input() getElement: any;
  @Input() element: any;
  @Input() keyboardEventName: string;
  queryAnswer: any;

  constructor() { }

  ngOnInit() {
  }

  describe(tag){
    let ret = ''
    if(this.keyboardEventName === 'queryAverage'){
      return this.queryAnswer;
    }
    else if(this.keyboardEventName === 'queryTendency'){
      return this.queryAnswer;
    }
    else if(tag.tagname === 'graph'){
      ret += this.describe(tag.children[0]) + ' ';
      ret += this.describe(tag.children[1]) + ' ';
      ret += this.describe(tag.children[2]) + ' ';
    }
    else if(tag.tagname === 'title'){
      ret += '차트 제목 ' + tag.title + '.';
    }
    else if(tag.tagname === 'y'){
      ret += `y축 레이블 ${tag.label ? tag.label : "없음"} 단위 ${tag.unit ? tag.unit : "없음"} `
      ret += `범위 ${tag.min}부터 ${tag.max ? tag.max : this.info.children[4].children.map(bargroup => bargroup.children.map(bar => bar.value)).reduce((a, b) => a.concat(b)).reduce((a,b) => Math.max(a,b)) }.`
      if(tag.lines.length){
        ret += ` y축 ${tag.lines.join(', ')}의 위치에 ${tag.lines.length}개의 선이 그어져 있습니다. `
      }
      if(tag.ranges.length){
        // TODO
      }

    }
    else if(tag.tagname === 'x'){
      ret += `x축 레이블 ${tag.lable ? tag.label : "없음"} 항목 ${tag.children.length}개 ${tag.children.map(d=>d.tick).join(', ')}.`
    }
    else if(tag.tagname === 'tick'){
      ret += tag.tick;
    }
    else if(tag.tagname === 'legend'){
      ret += `범례 항목 ${tag.children.length}개 ${tag.children.map(d=>d.item).join(', ')}.`
    }
    else if(tag.tagname === 'item'){
      let basic_description = `${tag.item}. `;
      if(tag._annotation){
        tag._annotation.components.forEach(component => {
          if(component.visible){
            if(component.type == 'trendline'){
              ret += `이 범례에 추세선이 그려져 있습니다. `
              let series = +tag._annotation.target.items[0].elements.slice(1) - 2;
              let data = this.info.children[4].children.map(bargroup => {
                return bargroup.children[series].value
              })
              let increase = Math.round(10 * (data[data.length-1] - data[0]))/10;
              if(increase > 0) ret += `전체 기간 동안 ${increase}만큼 상승했습니다. `
              else ret += `전체 기간 동안 ${-increase}만큼 하락했습니다. `
            }
          }
        })
      }
      if(this.keyboardEventName.endsWith('Annotation')) ret = ret + basic_description;
      else ret = basic_description + ret;
    }
    else if(tag.tagname === 'marks'){
      if(tag.children[0].children.length === 1){
        ret += `${tag.children.length}개의 막대가 있습니다.`
      }
      else
        ret += `${tag.children.length}개의 막대 그룹에 각각 ${tag.children[0].children.length}개의 막대가 있습니다.`
    }
    else if(tag.tagname === 'bargroup'){
      if(tag.children.length == 1)
        ret += this.describe(tag.children[0])
      else{
        if(this.keyboardEventName.startsWith('query')){
          if(this.keyboardEventName.endsWith('Maximum')){
            ret += `합이 가장 큰 막대그룹. `
          }
          else if(this.keyboardEventName.endsWith('Minimum')){
            ret += `합이 가장 작은 막대그룹. `
          }
        }
         ret += `막대그룹 이름 ${tag.name}. `
         ret += `총합 ${Math.round(tag.children.reduce((a,b) => a + b.value, 0) * 10) / 10}. `
      }
    }
    else if(tag.tagname === 'bar'){
      let bargroup = this.getElement(tag.parentId);
      let marks = this.getElement(bargroup.parentId);
      let graph = this.getElement(marks.parentId);
      let y = graph.children[1];
      if(['moveToNextDataPoint', 'moveToPreviousDataPoint'].indexOf(this.keyboardEventName) >= 0){
        ret += `${tag.value} ${tag.key} ${bargroup.name}`
      }
      else{
        if(this.keyboardEventName.startsWith('query')){
          if(this.keyboardEventName.endsWith('Maximum')){
            ret += `${tag.key} 중 가장 큰 막대. `
          }
          else if(this.keyboardEventName.endsWith('Minimum')){
            ret += `${tag.key} 중 가장 작은 막대. `
          }
        }
        let basic_description = `막대 그룹이름 ${bargroup.name} 범례 ${tag.key} ${y.label} ${tag.value}. `
        let annotation_description = tag.highlighted ? `강조되어 있는 막대입니다. ` : ''

        if(this.keyboardEventName.endsWith('Annotation')) ret += annotation_description + basic_description;
        else ret += basic_description + annotation_description;
      }
    }
    else if(tag.tagname === 'annotations'){
      ret += `어노테이션 총 ${tag.children.length}개`;
    }
    else if(tag.tagname === 'line'){
      ret += `${tag.axis}축 ${tag.range}의 위치에 선이 그어져 있습니다.`
      tag._annotation.components.forEach(component => {
        if(component.visible){
          if(component.type === "label"){
            ret += `: ${component.text}. `
          }
        }
      })

    }
    else if(tag.tagname === 'relationalLine'){
      ret += `${tag.axis}축 ${tag.range}의 위치에 그어진 선보다 ${tag.mode == 'below' ? '아래' : tag.mode}에 있는 모든 막대가 강조되어 있습니다.`
    }
    else if(tag.tagname === 'range'){
      ret += `${tag.axis}축 ${tag.rs} 이상 ${tag.rf} 미만의 범위가 표시되어 있습니다.`
    }
    else if(tag.tagname === 'relationalRange'){
      ret += `${tag.axis}축 ${tag.rs} 이상 ${tag.rf} 미만의 범위에 ${tag.mode == 'within-or-equal' ? '포함' : tag.mode}된 모든 막대가 강조되어 있습니다.`;
    }
    return ret;
  }


}
