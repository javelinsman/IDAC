import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_structure/chart_accent_json';
import { ChartInfo } from '../chart_structure/chart_info';
import { beep_error, beep_detect, speak } from '../utils';
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
  keyboardEventName: string;
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
        speak(this.description.describe(this.currentElement()));
      });
  }

  keyFire(eventName: string){
    if(this[eventName]() === false){
      beep_error();
    }
    else{
      this.keyboardEventName = eventName;
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

}