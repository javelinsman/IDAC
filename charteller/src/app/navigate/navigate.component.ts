import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_structure/chart_accent_json';
import { ChartInfo } from '../chart_structure/chart_info';
import { beep_error, beep_detect, speak, isAscendingArray, isDescendingArray } from '../utils';
import { accentToInfo } from '../chart_structure/accent_to_info';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  chart: Chart;
  info: ChartInfo;
  tags: any[];
  currentFocus: number;
  keyboardEventName: string = 'moveToNextElement';
  focusHistory: number[] = [];
  focusFootprints = {
    title: -1,
    xAxis: -1,
    yAxis: -1,
    legend: -1,
    marks: -1,
    dataPoints: -1
  }

  @ViewChild(DescriptionComponent) description: DescriptionComponent;

  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getChart();
  }

  setFocus(f, trace=true){
    if(trace) this.focusHistory.push(f);
    this.currentFocus = f;
  }

  getFocus(){
    return this.currentFocus;
  }

  currentElement() {
    if(this.tags){
      return this.tags[this.currentFocus];
    }
  }

  getElement(id: number) {
    return this.tags[id];
  }

  getElementSiblingIndex(id: number){
    let element = this.getElement(id);
    let parent = this.getElement(element.parentId);
    return parent.children.indexOf(element);
  }


  getChart(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.chart = this.chartService.getCharts().find(d => +d.id == +id);
    this.http.get(this.chart.src_json)
      .subscribe((chartAccent: ChartAccent.ChartAccentJSON) => {
        [this.info, this.tags] = accentToInfo(chartAccent);
        this.setFocus(1);
        console.log(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info))
        this.description.keyboardEventName = this.keyboardEventName;
        speak(this.description.describe(this.currentElement()))
      });
  }

  keyFire(eventName: string){
    if(this[eventName]() === false){
      beep_error();
    }
    else{
      this.keyboardEventName = eventName;
      this.description.keyboardEventName = eventName;
      speak(this.description.describe(this.currentElement()));
      if(this.currentElement().children) beep_detect();
    }
  }

  moveToNextElement(){
    if(this.getFocus() + 1 >= this.tags.length) return false;
    this.setFocus(this.getFocus() + 1);
  }

  moveToPreviousElement(){
    if(this.getFocus() - 1 < 1) return false;
    this.setFocus(this.getFocus() - 1);
  }

  moveToParent(){
    let element = this.currentElement()
    let parent = this.getElement(element.parentId)
    if(!parent || parent._id == 0) return false
    let element_index = parent.children.indexOf(element)
    parent['_bookmark'] = element_index
    this.setFocus(parent._id);
  }

  moveToChild(){
    let element = this.currentElement();
    if(!element.children) return false
    let bookmark = element._bookmark ? element._bookmark : 0;
    let child = element.children[bookmark]
    this.setFocus(child._id);
  }

  moveToNextAnnotation(){
    let nextAnnotation = this.tags.slice(this.getFocus()+1).find(tag => tag._annotation)
    if(nextAnnotation){
      this.setFocus(nextAnnotation._id);
    }
    else return false;
  }

  moveToPreviousAnnotation(){
    let prevAnnotation = this.tags.slice(0, this.getFocus()).reverse().find(tag => tag._annotation)
    if(prevAnnotation){
      this.setFocus(prevAnnotation._id);
    }
    else return false;
  }

  moveToNextSibling(element){
    if(!element) element = this.currentElement();
    let parent = this.getElement(element.parentId)
    if(!parent) return false;
    let element_index = parent.children.indexOf(element)
    if(element_index + 1 < parent.children.length){
      let nextSibling = parent.children[element_index + 1];
      this.setFocus(nextSibling._id);
    }
    else return false;
  }

  moveToPreviousSibling(element){
    if(!element) element = this.currentElement();
    let parent = this.getElement(element.parentId);
    if(!parent) return;
    let element_index = parent.children.indexOf(element)
    if(element_index - 1 >= 0){
      let prevSibling = parent.children[element_index - 1];
      this.setFocus(prevSibling._id);
    }
    else return false;
  }

  moveToPreviouslyVisitedElement() {
    if(this.focusHistory.length <= 1) return false;
    this.focusHistory.pop();
    this.setFocus(this.focusHistory.pop());
  }

  moveToNextFrame() {
    let element = this.currentElement();
    while(element.parentId != 0) element = this.getElement(element.parentId);
    return this.moveToNextSibling(element);
  }

  moveToPreviousFrame() {
    let element = this.currentElement();
    while(element.parentId != 0) element = this.getElement(element.parentId);
    return this.moveToPreviousSibling(element);
  }

  moveToTitle(){
    this.setFocus(this.getElement(0).children[0]._id);
  }

  moveToXAxis(){
    this.setFocus(this.getElement(0).children[2]._id);
  }

  moveToYAxis(){
    this.setFocus(this.getElement(0).children[1]._id);
  }

  moveToLegend(){
    this.setFocus(this.getElement(0).children[3]._id);
  }

  moveToMarks(){
    this.setFocus(this.getElement(0).children[4]._id);
  }

  moveToAnnotations(){
    this.setFocus(this.getElement(0).children[5]._id);
  }

  moveToNextDataPoint(){
    let focus = this.getFocus();
    while(focus + 1 < this.tags.length){
      focus += 1;
      if(this.getElement(focus).tagname === 'bar'){
        this.setFocus(focus);
        return;
      }
    }
    return false;
  }

  moveToPreviousDataPoint(){
    let focus = this.getFocus();
    while(focus - 1 >= 0){
      focus -= 1;
      if(this.getElement(focus).tagname === 'bar'){
        this.setFocus(focus);
        return;
      }
    }
    return false;
  }

  checkCurrentElement(){
    //should be empty
  }

  getAllBars(seriesIndex){
    return this.getAllBargroups().map(d => d.children[seriesIndex])
  }

  getAllBargroups(){
    return this.tags.filter(d => d.tagname === 'bargroup')
  }

  queryMaximum(){
    let element = this.currentElement()
    if(element.tagname === 'bar'){
      let bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      let maximum_bar = bars.reduce((a, b) => a.value > b.value ? a : b);
      this.setFocus(maximum_bar._id);
    }
    else {
      let bargroups = this.getAllBargroups();
      let maximumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.value, 0), i])
        .reduce((a, b) => a[0] > b[0] ? a : b)[1];
      this.setFocus(bargroups[maximumGroupIndex]._id);
    }
  }

  queryMinimum(){
    let element = this.currentElement()
    if(element.tagname === 'bar'){
      let bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      let minimum_bar = bars.reduce((a, b) => a.value < b.value ? a : b);
      this.setFocus(minimum_bar._id);
    }
    else {
      let bargroups = this.getAllBargroups();
      let minimumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.value, 0), i])
        .reduce((a, b) => a[0] < b[0] ? a : b)[1];
      this.setFocus(bargroups[minimumGroupIndex]._id);
    }
  }

  queryAverage(){
    let element = this.currentElement()
    if(element.tagname === 'bar'){
      let bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      let bars_sum = bars.reduce((a, b) => a + b.value, 0)
      this.description.queryAnswer = `${element.key} 평균 ${Math.round(bars_sum / bars.length * 10) / 10}. `;
    }
    else {
      let bargroups = this.getAllBargroups();
      let sum_bargroups = bargroups.map((bargroup, i) =>
          bargroup.children.reduce((a, b) => a + b.value, 0))
          .reduce((a, b) => a + b)
      this.description.queryAnswer = `막대그룹 평균 ${Math.round(sum_bargroups / bargroups.length * 10) / 10}. `;
    }
  }

  queryTendency(){
    let element = this.currentElement()
    if(element.tagname === 'bar'){
      let bars = this.getAllBars(this.getElementSiblingIndex(element._id)).map(d => d.value);
      if(isAscendingArray(bars)) this.description.queryAnswer = `${element.key} 막대가 오름차순으로 정렬되어 있습니다.`
      else if(isDescendingArray(bars)) this.description.queryAnswer = `${element.key} 막대가 내림차순으로 정렬되어 있습니다.`
      else this.description.queryAnswer = `${element.key} 막대는 정렬되어 있지 않습니다`
    }
    else {
      let bargroups = this.getAllBargroups();
      let reduced_bargroups = bargroups
        .map(bargroup => bargroup.children.reduce((a, b) => a + b.value, 0))
      if(isAscendingArray(reduced_bargroups)) this.description.queryAnswer = '막대그룹 총합이 오름차순으로 정렬되어 있습니다.'
      else if(isDescendingArray(reduced_bargroups)) this.description.queryAnswer = '막대그룹 총합이 내림차순으로 정렬되어 있습니다.'
      else this.description.queryAnswer = '막대그룹 총합은 정렬되어 있지 않습니다'
    }
  }


}
