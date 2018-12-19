import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_accent_json';
import { ChartInfo } from '../chart_info';
import { eqArray, eqSet } from '../utils';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  chart: Chart;
  info: ChartInfo;
  currentFocus: number;
  tags;
  keydowns;
  
  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getChart();
    this.attachKeyboardListener();
  }

  attachKeyboardListener(){
    this.keydowns = new Set();
    let _this = this;
    function keyboardListener(key, event){
      if(event === 'down') _this.keydowns.add(key);
      if(event ==='up'){
        _this.keyFire();
        _this.keydowns.delete(key);
      }
    }
    document.addEventListener('keydown', function(e){e.preventDefault(); keyboardListener(e.key.toLowerCase(), 'down')});
    document.addEventListener('keyup', function(e){e.preventDefault(); keyboardListener(e.key.toLowerCase(), 'up')});
  }

  getChart(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.chart = this.chartService.getCharts().find(d => +d.id == +id);
    this.http.get(this.chart.src_json)
      .subscribe((chartAccent: ChartAccent.ChartAccentJSON) => {
        this.tags = [];
        this.info = this.convert(chartAccent);
        this.currentFocus = 0;
        console.log(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info))
        this.speak(this.describe(this.currentElement()))
      });
  }


  keyFire(){
    console.log(this.keydowns);
    if(eqSet(this.keydowns, new Set(['tab']))){
      this.moveToNextElement();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['shift', 'tab']))){
      this.moveToPreviousElement();
      this.speak(this.describe(this.currentElement()))
    }
  }

  speak (message) {
    var msg = new SpeechSynthesisUtterance(message)
    msg.lang = 'ko-KR';
    msg.rate = 3;
    window.speechSynthesis.speak(msg)
  }

  describe(tag) {
    let ret = ''
    if(tag.tagname === 'graph'){
      ret += this.describe(tag.children[0]);
      ret += this.describe(tag.children[1]);
      ret += this.describe(tag.children[2]);
    }
    else if(tag.tagname === 'title'){
      ret += '차트 제목 ' + tag.title + '.';
    }
    else if(tag.tagname === 'y'){
      ret += `y축 레이블 ${tag.label ? tag.label : "없음"} 단위 ${tag.unit ? tag.unit : "없음"} 범위 ${tag.min}부터 ${tag.max}.`
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
      ret += tag.item;
    }
    else if(tag.tagname === 'marks'){
      ret += `${tag.children.length}개의 막대 그룹에 각각 ${tag.children[0].children.length}개의 막대가 있습니다.`
    }
    else if(tag.tagname === 'bargroup'){
      ret += `막대그룹 이름 ${tag.name}.`
    }
    else if(tag.tagname === 'bar'){
      let bargroup = this.getElement(tag.parentId);
      let marks = this.getElement(bargroup.parentId);
      let graph = this.getElement(marks.parentId);
      let y = graph.children[1];
      ret += `막대 그룹이름 ${bargroup.name} 범례 ${tag.key} ${y.label} ${tag.value}.`
    }
    return ret;
  }

  moveToNextElement(){
    this.currentFocus += 1;
    this.currentFocus %= this.tags.length;
  }

  moveToPreviousElement(){
    this.currentFocus += this.tags.length - 1;
    this.currentFocus %= this.tags.length;
  }

  currentElement() {
    return this.tags[this.currentFocus];
  }

  getElement(id: number) {
    return this.tags[id];
  }

  convert(ca: ChartAccent.ChartAccentJSON): ChartInfo {
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
          label: ca.chart.xLabel,
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
        },
        {
          tagname: 'annotations',
          children: ca.annotations.annotations.map((annotation, i) => {
            return {
              tagname: 'annotation',
              id: i,
              type: annotation.target.type
            };
          })
        }
      ]
    }

    let idCount = 0;
    let tags = this.tags;
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
    return chartInfo
  }
}
