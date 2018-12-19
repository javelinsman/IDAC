import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_accent_json';
import { ChartInfo } from '../chart_info';
import { eqArray, eqSet, beep, beep_error, beep_detect } from '../utils';
import { TargetLocator } from 'selenium-webdriver';
import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  chart: Chart;
  info: ChartInfo;
  currentFocus: number;
  prevFocus: number;
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
        this.currentFocus = 1;
        console.log(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info))
        this.speak(this.describe(this.currentElement()))
      });
  }


  keyFire(){
    console.log(this.keydowns);
    this.prevFocus = this.currentFocus
    let shot = false;
    if(eqSet(this.keydowns, new Set(['tab']))){
      this.moveToNextElement();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['shift', 'tab']))){
      this.moveToPreviousElement();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['d']))){
      this.moveToNextAnnotation();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['shift', 'd']))){
      this.moveToPreviousAnnotation();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['arrowright']))){
      this.moveToNextSibling();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['arrowleft']))){
      this.moveToPreviousSibling();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['arrowup']))){
      this.moveToParent();
      shot = true;
    }
    else if(eqSet(this.keydowns, new Set(['arrowdown']))){
      this.moveToChild();
      shot = true;
    }
    if(shot){
      if(this.prevFocus === this.currentFocus) beep_error();
      else{
        this.speak(this.describe(this.currentElement()))
        if(this.currentElement().children) beep_detect();
      }
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
    if(!parent || parent._id == 0) return
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

    return chartInfo
  }
}
