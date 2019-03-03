import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpecTag } from '../chart-structure/chart-spec/spec-tag';
import { MessageService } from '../message.service';
import { SpeakingService } from '../speaking.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  @Input() sandbox = false;
  @Input() tag: SpecTag;
  @Output() tagChange: EventEmitter<SpecTag> = new EventEmitter();


  focusBookmarks = {};
  focusHistory: SpecTag[] = [];

  /*
  currentFocus: number;
  keyboardEventName = 'moveToNextElement';
  focusFootprints = {
    title: -1,
    xAxis: -1,
    yAxis: -1,
    legend: -1,
    marks: -1,
    dataPoints: -1
  };
  */


  constructor(
    private messageService: MessageService,
    private speakingService: SpeakingService
  ) { }

  ngOnInit() {
  }

  keyFire(eventName: string) {
    console.log(`keyfire: ${eventName}`);
    if (this[eventName]() === false) {
      this.speakingService.beep_error();
    } else {
      if (this.tag.children && this.tag.children.length) {
        this.speakingService.beep_detect();
      }
      this.speakingService.read(this.tag.describe());
    }
  }

  setFocus(tag: SpecTag) {
    if (this.sandbox) {
      this.focusHistory.push(this.tag);
      this.tag = tag;
    } else {
      this.focusHistory.push(this.tag);
      this.tag = tag;
      this.tagChange.emit(this.tag);
      this.messageService.shouldScroll = true;
    }
  }

  stopSpeaking() {
    this.speakingService.stop();
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

  getElementSiblingIndex(tag: SpecTag) {
    if (!tag) {
      tag = this.tag;
    }
    if (tag._parent) {
      return {
        index: tag._parent.children.indexOf(tag),
        length: tag._parent.children.length
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
    if (!this.tag._parent || this.tag._parent._id === 0) {
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

  moveToNextSibling(tag: SpecTag) {
    if (!tag) {
      tag = this.tag;
    }
    const { index, length } = this.getElementSiblingIndex(tag);
    if (index + 1 < length) {
      this.setFocus(tag._parent.children[index + 1]);
    } else {
      return false;
    }
  }

  moveToPreviousSibling(tag: SpecTag) {
    if (!tag) {
      tag = this.tag;
    }
    const { index } = this.getElementSiblingIndex(tag);
    if (index - 1 >= 0) {
      this.setFocus(tag._parent.children[index - 1]);
    } else {
      return false;
    }
  }

  moveToPreviouslyVisitedElement() {
    if (!this.focusHistory.length) {
      return false;
    }
    this.setFocus(this.focusHistory.pop());
    this.focusHistory.pop();
  }

  moveToNextDataPoint() {
    const tags = this.tag._root.flattenedTags();
    let index = tags.indexOf(this.tag);
    while (index + 1 < tags.length) {
      index += 1;
      if (tags[index]._tagname === 'Bar') {
        this.setFocus(tags[index]);
        return;
      }
    }
    return false;
  }

  moveToPreviousDataPoint() {
    const tags = this.tag._root.flattenedTags();
    let index = tags.indexOf(this.tag);
    while (index - 1 >= 0) {
      index -= 1;
      if (tags[index]._tagname === 'Bar') {
        this.setFocus(tags[index]);
        return;
      }
    }
    return false;
  }

  moveToNextAnnotation() {
    const tags = this.tag._root.flattenedTags();
    let index = tags.indexOf(this.tag);
    while (index + 1 < tags.length) {
      index += 1;
      if (tags[index]._parent && tags[index]._parent._tagname === 'Annotations') {
        this.setFocus(tags[index]);
        return;
      }
    }
    return false;
  }
  moveToPreviousAnnotation() {
    const tags = this.tag._root.flattenedTags();
    let index = tags.indexOf(this.tag);
    while (index - 1 >= 0) {
      index -= 1;
      if (tags[index]._parent && tags[index]._parent._tagname === 'Annotations') {
        this.setFocus(tags[index]);
        return;
      }
    }
    return false;
  }


  moveToNextFrame() {
    let tag = this.tag;
    while (tag._parent._id !== 0) {
      tag = tag._parent;
    }
    return this.moveToNextSibling(tag);
  }

  moveToPreviousFrame() {
    let tag = this.tag;
    while (tag._parent._id !== 0) {
      tag = tag._parent;
    }
    return this.moveToPreviousSibling(tag);
  }

  /*
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
