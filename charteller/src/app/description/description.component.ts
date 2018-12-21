import { Component, OnInit, Input } from '@angular/core';
import { ChartInfo } from '../chart_structure/chart_info';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  @Input() info: ChartInfo;
  @Input() getElement: any;
  @Input() element: any;

  constructor() { }

  ngOnInit() {
  }

  describe(tag) {
    let ret = ''
    if(tag.tagname === 'graph'){
      ret += this.describe(tag.children[0]) + ' ';
      ret += this.describe(tag.children[1]) + ' ';
      ret += this.describe(tag.children[2]) + ' ';
    }
    else if(tag.tagname === 'title'){
      ret += '차트 제목 ' + tag.title + '.';
    }
    else if(tag.tagname === 'y'){
      if(tag._annotation){
        ret += `y축 ${tag._annotation.target.range}의 위치에 강조선이 있습니다. `
        tag._annotation.components.forEach(component => {
          if(component.visible){
            if(component.type === "label"){
              ret += `강조선 설명: ${component.text}. `
            }
          }
        })
      }
      ret += `y축 레이블 ${tag.label ? tag.label : "없음"} 단위 ${tag.unit ? tag.unit : "없음"} `
      ret += `범위 ${tag.min}부터 ${tag.max ? tag.max : this.info.children[4].children.map(bargroup => bargroup.children.map(bar => bar.value)).reduce((a, b) => a.concat(b)).reduce((a,b) => Math.max(a,b)) }.`
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
      ret += `${tag.item}. `;
      if(tag._annotation){
        tag._annotation.components.forEach(component => {
          if(component.visible){
            if(component.type == 'trendline'){
              ret += `이 범례에 추세선이 그려져 있습니다.`
              let series = +tag._annotation.target.items[0].elements.slice(1) - 2;
              let data = this.info.children[4].children.map(bargroup => {
                return bargroup.children[series].value
              })
              let increase = Math.round(10 * (data[data.length-1] - data[0]))/10;
              if(increase > 0) ret += `전체 기간 동안 ${increase}만큼 상승했습니다.`
              else ret += `전체 기간 동안 ${-increase}만큼 하락했습니다.`
            }
          }
        })
      }
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
      else ret += `막대그룹 이름 ${tag.name}.`
    }
    else if(tag.tagname === 'bar'){
      let bargroup = this.getElement(tag.parentId);
      let marks = this.getElement(bargroup.parentId);
      let graph = this.getElement(marks.parentId);
      let y = graph.children[1];
      if(tag._annotation){
        if(tag._annotation.target_inherit){
          if(tag._annotation.target_inherit.mode === "below"){
            ret += `${tag._annotation.target.range}보다 아래에 있는 막대입니다. `
          }
        }
        else{
          ret += `강조되어 있는 막대입니다. `
        }
      }
      ret += `막대 그룹이름 ${bargroup.name} 범례 ${tag.key} ${y.label} ${tag.value}.`
    }
    return ret;
  }


}
