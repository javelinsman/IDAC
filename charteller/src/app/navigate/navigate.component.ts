import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartService } from '../chart.service';
import { beep_error, beep_detect, speak, isAscendingArray, isDescendingArray } from '../utils';
import { DescriptionComponent } from '../description/description.component';
import { ChartInfo } from '../chart-structure/chart-info/chart-info';
import { ChartAccent } from '../chart-structure/chart-accent/chart-accent';

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
  keyboardEventName = 'moveToNextElement';
  focusHistory: number[] = [];
  focusFootprints = {
    title: -1,
    xAxis: -1,
    yAxis: -1,
    legend: -1,
    marks: -1,
    dataPoints: -1
  };

  @ViewChild(DescriptionComponent) description: DescriptionComponent;

  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getChart();
  }

  setFocus(f, trace = true) {
    if (trace) {
      this.focusHistory.push(f);
    }
    this.currentFocus = f;
  }

  getFocus() {
    return this.currentFocus;
  }

  currentElement() {
    if (this.tags) {
      return this.tags[this.currentFocus];
    }
  }

  getElement(id: number) {
    return this.tags[id];
  }

  getElementSiblingIndex(id: number) {
    const element = this.getElement(id);
    const parent = this.getElement(element.parentId);
    return parent.children.indexOf(element);
  }


  getChart(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.chart = this.chartService.getCharts().find(d => +d.id === +id);
    this.http.get(this.chart.src_json)
      .subscribe((chartAccent: ChartAccent) => {
        this.info = new ChartInfo(chartAccent);
        this.tags = this.info.flattenedTags();
        this.setFocus(1);
        console.log(chartAccent);
        console.log(this.info);
        console.log(Object.entries(this.info));
        this.description.keyboardEventName = this.keyboardEventName;
        speak(this.description.describe(this.currentElement()));
      });
  }

  keyFire(eventName: string) {
    if (this[eventName]() === false) {
      beep_error();
    } else {
      this.keyboardEventName = eventName;
      this.description.keyboardEventName = eventName;
      speak(this.description.describe(this.currentElement()));
      if (this.currentElement().children) {
        beep_detect();
      }
    }
  }

  moveToNextElement() {
    if (this.getFocus() + 1 >= this.tags.length) {
      return false;
    }
    this.setFocus(this.getFocus() + 1);
  }

  moveToPreviousElement() {
    if (this.getFocus() - 1 < 1) {
      return false;
    }
    this.setFocus(this.getFocus() - 1);
  }

  moveToParent() {
    const element = this.currentElement();
    const parent = this.getElement(element.parentId);
    if (!parent || parent._id === 0) {
      return false;
    }
    const element_index = parent.children.indexOf(element);
    parent['_bookmark'] = element_index;
    this.setFocus(parent._id);
  }

  moveToChild() {
    const element = this.currentElement();
    if (!element.children) {
      return false;
    }
    const bookmark = element._bookmark ? element._bookmark : 0;
    const child = element.children[bookmark];
    this.setFocus(child._id);
  }

  moveToNextAnnotation() {
    const nextAnnotation = this.tags.slice(this.getFocus() + 1)
      .find(tag => tag._annotation);
    if (nextAnnotation) {
      this.setFocus(nextAnnotation._id);
    } else {
      return false;
    }
  }

  moveToPreviousAnnotation() {
    const prevAnnotation = this.tags.slice(0, this.getFocus())
      .reverse().find(tag => tag._annotation);
    if (prevAnnotation) {
      this.setFocus(prevAnnotation._id);
    } else {
      return false;
    }
  }

  moveToNextSibling(element) {
    if (!element) {
      element = this.currentElement();
    }
    const parent = this.getElement(element.parentId);
    if (!parent) {
      return false;
    }
    const element_index = parent.children.indexOf(element);
    if (element_index + 1 < parent.children.length) {
      const nextSibling = parent.children[element_index + 1];
      this.setFocus(nextSibling._id);
    } else {
      return false;
    }
  }

  moveToPreviousSibling(element) {
    if (!element) {
      element = this.currentElement();
    }
    const parent = this.getElement(element.parentId);
    if (!parent) {
      return;
    }
    const element_index = parent.children.indexOf(element);
    if (element_index - 1 >= 0) {
      const prevSibling = parent.children[element_index - 1];
      this.setFocus(prevSibling._id);
    } else {
      return false;
    }
  }

  moveToPreviouslyVisitedElement() {
    if (this.focusHistory.length <= 1) {
      return false;
    }
    this.focusHistory.pop();
    this.setFocus(this.focusHistory.pop());
  }

  moveToNextFrame() {
    let element = this.currentElement();
    while (element.parentId !== 0) {
      element = this.getElement(element.parentId);
    }
    return this.moveToNextSibling(element);
  }

  moveToPreviousFrame() {
    let element = this.currentElement();
    while (element.parentId !== 0) {
      element = this.getElement(element.parentId);
    }
    return this.moveToPreviousSibling(element);
  }

  moveToTitle() {
    this.setFocus(this.getElement(0).children[0]._id);
  }

  moveToXAxis() {
    this.setFocus(this.getElement(0).children[2]._id);
  }

  moveToYAxis() {
    this.setFocus(this.getElement(0).children[1]._id);
  }

  moveToLegend() {
    this.setFocus(this.getElement(0).children[3]._id);
  }

  moveToMarks() {
    this.setFocus(this.getElement(0).children[4]._id);
  }

  moveToAnnotations() {
    this.setFocus(this.getElement(0).children[5]._id);
  }

  moveToNextDataPoint() {
    let focus = this.getFocus();
    while (focus + 1 < this.tags.length) {
      focus += 1;
      if (this.getElement(focus).tagname === 'bar') {
        this.setFocus(focus);
        return;
      }
    }
    return false;
  }

  moveToPreviousDataPoint() {
    let focus = this.getFocus();
    while (focus - 1 >= 0) {
      focus -= 1;
      if (this.getElement(focus).tagname === 'bar') {
        this.setFocus(focus);
        return;
      }
    }
    return false;
  }

  checkCurrentElement() {
    // this function should be empty.
    return;
  }

  getAllBars(seriesIndex) {
    return this.getAllBargroups().map(d => d.children[seriesIndex]);
  }

  getAllBargroups() {
    return this.tags.filter(d => d.tagname === 'bargroup');
  }

  queryMaximum() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      const maximum_bar = bars.reduce((a, b) => a.value > b.value ? a : b);
      this.setFocus(maximum_bar._id);
    } else {
      const bargroups = this.getAllBargroups();
      const maximumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.value, 0), i])
        .reduce((a, b) => a[0] > b[0] ? a : b)[1];
      this.setFocus(bargroups[maximumGroupIndex]._id);
    }
  }

  queryMinimum() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      const minimum_bar = bars.reduce((a, b) => a.value < b.value ? a : b);
      this.setFocus(minimum_bar._id);
    } else {
      const bargroups = this.getAllBargroups();
      const minimumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.value, 0), i])
        .reduce((a, b) => a[0] < b[0] ? a : b)[1];
      this.setFocus(bargroups[minimumGroupIndex]._id);
    }
  }

  queryAverage() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      const bars_sum = bars.reduce((a, b) => a + b.attributes.value, 0);
      this.description.queryAnswer = `The average of ${element.attributes.key} is ${Math.round(bars_sum / bars.length * 10) / 10}. `;
    } else {
      const bargroups = this.getAllBargroups();
      const sum_bargroups = bargroups.map((bargroup, i) =>
          bargroup.children.reduce((a, b) => a + b.attributes.value, 0))
          .reduce((a, b) => a + b);
      this.description.queryAnswer = `The average of total value in each bargroup is ${
        Math.round(sum_bargroups / bargroups.length * 10) / 10}. `;
    }
  }

  queryTendency() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id)).map(d => d.value);
      if (isAscendingArray(bars)) {
        this.description.queryAnswer = `${element.key} 막대가 오름차순으로 정렬되어 있습니다.`;
      } else if (isDescendingArray(bars)) {
        this.description.queryAnswer = `${element.key} 막대가 내림차순으로 정렬되어 있습니다.`;
      } else {
        this.description.queryAnswer = `${element.key} 막대는 정렬되어 있지 않습니다`;
      }
    } else {
      const bargroups = this.getAllBargroups();
      const reduced_bargroups = bargroups
        .map(bargroup => bargroup.children.reduce((a, b) => a + b.value, 0));
      if (isAscendingArray(reduced_bargroups)) {
        this.description.queryAnswer = '막대그룹 총합이 오름차순으로 정렬되어 있습니다.';
      } else if (isDescendingArray(reduced_bargroups)) {
        this.description.queryAnswer = '막대그룹 총합이 내림차순으로 정렬되어 있습니다.';
      } else {
        this.description.queryAnswer = '막대그룹 총합은 정렬되어 있지 않습니다';
      }
    }
  }


}
