import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_accent_json';
import { ChartInfo } from '../chart_info';
import { eqArray, eqSet } from '../utils';
import { TargetLocator } from 'selenium-webdriver';

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
    else if(eqSet(this.keydowns, new Set(['d']))){
      this.moveToNextAnnotation();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['shift', 'd']))){
      this.moveToPreviousAnnotation();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['arrowright']))){
      this.moveToNextSibling();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['arrowleft']))){
      this.moveToPreviousSibling();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['arrowup']))){
      this.moveToParent();
      this.speak(this.describe(this.currentElement()))
    }
    else if(eqSet(this.keydowns, new Set(['arrowdown']))){
      this.moveToChild();
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
      ret += tag.item;
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
      if(tag._annotation) ret += '강조되어 있습니다. '
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

  moveToParent(){
    let element = this.currentElement()
    let parent = this.getElement(element.parentId)
    if(!parent) return
    let element_index = parent.children.indexOf(element)
    parent['_bookmark'] = element_index
    this.currentFocus = parent._id;
  }

  moveToChild(){
    let element = this.currentElement();
    if(!element.children) return
    let bookmark = element._bookmark ? element._bookmark : 0;
    let child = element.children[bookmark]
    this.currentFocus = child._id;
  }

  moveToNextAnnotation(){
    let nextAnnotation = this.tags.slice(this.currentFocus+1).find(tag => tag._annotation)
    if(nextAnnotation){
      this.currentFocus = nextAnnotation._id;
    }
  }

  moveToPreviousAnnotation(){
    let prevAnnotation = this.tags.slice(0, this.currentFocus).reverse().find(tag => tag._annotation)
    if(prevAnnotation){
      this.currentFocus = prevAnnotation._id;
    }
  }

  moveToNextSibling(){
    let element = this.currentElement()
    let parent = this.getElement(element.parentId)
    if(!parent) return
    let element_index = parent.children.indexOf(element)
    if(element_index + 1 < parent.children.length){
      let nextSibling = parent.children[element_index + 1];
      this.currentFocus = nextSibling._id;
    }
  }

  moveToPreviousSibling(){
    let element = this.currentElement()
    let parent = this.getElement(element.parentId)
    if(!parent) return
    let element_index = parent.children.indexOf(element)
    if(element_index - 1 >= 0){
      let prevSibling = parent.children[element_index - 1];
      this.currentFocus = prevSibling._id;
    }
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

    if(false && chartInfo.children[4].children[0].children.length == 1){
      chartInfo.children[4].children = [
        {
          tagname: 'bargroup',
          name: chartInfo.children[2].label,
          children: chartInfo.children[4].children.map(bargroup =>
              bargroup.children[0]),
          annotation: undefined
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

    ca.annotations.annotations.forEach((annotation, aid: number) => {
      if(!annotation.target_inherit){
        if(annotation.target.type === "items"){
          annotation.target.items.forEach(item => {
            let series = +(item.elements.slice(1)) - 2;
            let indices = item.items.map(dataindex => {
              return JSON.parse(dataindex)[2]
            })
            console.log(series)
            console.log(indices)
            indices.forEach(index => {
              let bar = chartInfo.children[4].children[index].children[series]
              console.log(bar)
              bar['_annotation'] = annotation;
            })
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

    return chartInfo
  }
}
