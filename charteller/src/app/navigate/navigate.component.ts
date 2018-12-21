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
  prevFocus: number;

  @ViewChild(DescriptionComponent) description: DescriptionComponent;

  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getChart();
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
        speak(this.description.describe(this.currentElement()));
      });
  }

  keyFire(eventName: string){
    this.prevFocus = this.currentFocus
    if(eventName === 'moveToNextElement') this.moveToNextElement();
    if(eventName === 'moveToPreviousElement') this.moveToPreviousElement();
    if(eventName === 'moveToNextAnnotation') this.moveToNextAnnotation();
    if(eventName === 'moveToPreviousAnnotation') this.moveToPreviousAnnotation();
    if(eventName === 'moveToNextSibling') this.moveToNextSibling();
    if(eventName === 'moveToPreviousSibling') this.moveToPreviousSibling();
    if(eventName === 'moveToParent') this.moveToParent();
    if(eventName === 'moveToChild') this.moveToChild();
    
    if(this.prevFocus === this.currentFocus) beep_error();
    else{
      speak(this.description.describe(this.currentElement()));
      if(this.currentElement().children) beep_detect();
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
    if(this.tags){
      return this.tags[this.currentFocus];
    }
  }

  getElement(id: number) {
    return this.tags[id];
  }
}