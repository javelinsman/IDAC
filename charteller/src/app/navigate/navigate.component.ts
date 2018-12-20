import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import * as ChartAccent from '../chart_structure/chart_accent_json';
import { ChartInfo } from '../chart_structure/chart_info';
import { eqSet, beep_error, beep_detect, speak } from '../utils';
import { accentToInfo } from '../chart_structure/accent_to_info';

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
  prevFocus: number;
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
    const _this = this;
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
        [this.info, this.tags] = accentToInfo(chartAccent);
        this.currentFocus = 1;
        console.log(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info))
        //speak(this.describe(this.currentElement()))
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
        //speak(this.describe(this.currentElement()))
        if(this.currentElement().children) beep_detect();
      }
    }
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
}