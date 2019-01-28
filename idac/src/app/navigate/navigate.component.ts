import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chart } from '../chart';
import { ChartExampleService } from '../chart-example.service';
import { beep_error, beep_detect, speak, isAscendingArray, isDescendingArray } from '../utils';
import { DescriptionComponent } from '../description/description.component';
import { ChartSpec } from '../chart-structure/chart-spec/chart-spec';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  @Input() tag: SpecTag;
  @Output() tagChange: EventEmitter<SpecTag> = new EventEmitter();

  focusBookmarks = {};

  /*
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
  */


  constructor() { }

  ngOnInit() {
  }

  keyFire(eventName: string) {
    console.log(`keyfire: ${eventName}`);
    if (this[eventName]() === false) {
      beep_error();
    } else {
      if (this.tag.children && this.tag.children.length) {
        beep_detect();
      }
    }
  }

  setFocus(tag: SpecTag) {
    this.tag = tag;
    this.tagChange.emit(this.tag);
  }

  checkCurrentElement() {
    // this function should be empty.
    return;
  }

  moveToTitle() {
    this.setFocus(this.tag._root.title);
  }

  moveToYAxis() {
    this.setFocus(this.tag._root.y);
  }

  moveToXAxis() {
    this.setFocus(this.tag._root.x);
  }

  moveToLegend() {
    this.setFocus(this.tag._root.legend);
  }

  moveToMarks() {
    this.setFocus(this.tag._root.marks);
  }

  moveToAnnotations() {
    this.setFocus(this.tag._root.annotations);
  }

  getElement(id: number) {
    return this.tag._root.findById(id);
  }

  getElementSiblingIndex() {
    if (this.tag._parent) {
      return {
        index: this.tag._parent.children.indexOf(this.tag),
        length: this.tag._parent.children.length
      };
    } else {
      return {
        index: 0,
        length: 1
      };
    }
  }


  moveToNextElement() {
    const tags = this.tag._root.flattenedTags();
    const index = tags.indexOf(this.tag);
    if (index + 1 >= tags.length) {
      return false;
    }
    this.setFocus(tags[index + 1]);
  }

  moveToPreviousElement() {
    const tags = this.tag._root.flattenedTags();
    const index = tags.indexOf(this.tag);
    if (index - 1 < 0) {
      return false;
    }
    this.setFocus(tags[index - 1]);
  }

  moveToParent() {
    if (!this.tag._parent) {
      return false;
    }
    this.focusBookmarks[this.tag._parent._id] = this.tag._id;
    this.setFocus(this.tag._parent);
  }

  moveToChild() {
    if (!this.tag.children || !this.tag.children.length) {
      return false;
    }
    if (this.focusBookmarks[this.tag._id]) {
      this.setFocus(this.getElement(this.focusBookmarks[this.tag._id]));
    } else {
      this.setFocus(this.tag.children[0]);
    }
  }

  /*

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
      const maximum_bar = bars.reduce((a, b) => a.attributes.value > b.attributes.value ? a : b);
      this.setFocus(maximum_bar._id);
      this.description.queryAnswer = 'This is the highest bar in series $(seriesName):';
    } else {
      const bargroups = this.getAllBargroups();
      const maximumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.attributes.value, 0), i])
        .reduce((a, b) => a[0] > b[0] ? a : b)[1];
      this.setFocus(bargroups[maximumGroupIndex]._id);
      this.description.queryAnswer = 'This is a bargroup with the highest sum:';
    }
  }

  queryMinimum() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      const minimum_bar = bars.reduce((a, b) => a.attributes.value < b.attributes.value ? a : b);
      this.setFocus(minimum_bar._id);
      this.description.queryAnswer = 'This is the smallest bar in series $(seriesName):';
    } else {
      const bargroups = this.getAllBargroups();
      const minimumGroupIndex: number = bargroups
        .map((bargroup, i) =>
          [bargroup.children.reduce((a, b) => a + b.attributes.value, 0), i])
        .reduce((a, b) => a[0] < b[0] ? a : b)[1];
      this.setFocus(bargroups[minimumGroupIndex]._id);
      this.description.queryAnswer = 'This is a bargroup with the smallest sum:';
    }
  }

  queryAverage() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id));
      const bars_sum = bars.reduce((a, b) => a + b.attributes.value, 0);
      this.description.queryAnswer = `The average of ${element.attributes.seriesName} is ${Math.round(bars_sum / bars.length * 10) / 10}. `;
    } else {
      const bargroups = this.getAllBargroups();
      const sum_bargroups = bargroups.map((bargroup, i) =>
          bargroup.children.reduce((a, b) => a + b.attributes.value, 0))
          .reduce((a, b) => a + b);
      this.description.queryAnswer = `The average of the sum of each bargroup is ${
        Math.round(sum_bargroups / bargroups.length * 10) / 10}. `;
    }
  }

  queryTendency() {
    const element = this.currentElement();
    if (element.tagname === 'bar') {
      const bars = this.getAllBars(this.getElementSiblingIndex(element._id)).map(d => d.attributes.value);
      if (isAscendingArray(bars)) {
        this.description.queryAnswer = `${element.attributes.seriesName} is sorted in ascending order.`;
      } else if (isDescendingArray(bars)) {
        this.description.queryAnswer = `${element.attributes.seriesName} is sorted in descending order.`;
      } else {
        this.description.queryAnswer = `${element.attributes.seriesName} is not sorted.`;
      }
    } else {
      const bargroups = this.getAllBargroups();
      const reduced_bargroups = bargroups
        .map(bargroup => bargroup.children.reduce((a, b) => a + b.attributes.value, 0));
      if (isAscendingArray(reduced_bargroups)) {
        this.description.queryAnswer = 'The sum of each bargroup is sorted in ascending order.';
      } else if (isDescendingArray(reduced_bargroups)) {
        this.description.queryAnswer = 'The sum of each bargroup is sorted in descending order.';
      } else {
        this.description.queryAnswer = 'The sum of each bargroup is not sorted.';
      }
    }
  }
  */
}
