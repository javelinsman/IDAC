import { Component, OnInit, Input, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { keyBindings, KeyBindings, KeyBinding } from 'src/app/keyboard-input/key-bindings';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { NavigateComponent } from 'src/app/navigate/navigate.component';

@Component({
  selector: 'app-chart-spec-tree-view-key-hint',
  templateUrl: './chart-spec-tree-view-key-hint.component.html',
  styleUrls: ['./chart-spec-tree-view-key-hint.component.scss']
})
export class ChartSpecTreeViewKeyHintComponent implements OnInit, AfterContentChecked {

  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;

  @ViewChild(NavigateComponent) navigateComponent: NavigateComponent;

  prevTag = null;
  keyBindings: KeyBindings = keyBindings;
  reachableKeys: any[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    if (this.prevTag !== this.currentTag) {
      this.prevTag = this.currentTag;
      this.refreshReachableKeys();
    }
  }

  refreshReachableKeys() {
    this.reachableKeys =[];
    if (this.tag === this.currentTag) {
      // this.reachableKeys.push('⏎');
    } else {
      Object.entries(this.keyBindings).forEach(([methodName, keyBinding]) => {
        this.navigateComponent.tag = this.currentTag;
        this.navigateComponent[methodName]();
        if(this.navigateComponent.tag === this.tag) {
          this.reachableKeys.push({
            key: this.shorten(Array.from(keyBinding).join('+')),
            tooltip: this.tooltipDescription(methodName, keyBinding)
          });
        }
      });
      this.reachableKeys = this.reachableKeys.slice(0, 5);
    }
  }

  shorten(keyBinding: string) {
    switch (keyBinding) {
      case 'arrowdown':
        return '↓';
      case 'arrowup':
        return '↑';
      case 'arrowleft':
        return '←';
      case 'arrowright':
        return '→';
      default:
        return keyBinding.toLocaleUpperCase().replace('SHIFT+', '⇧ ');
    }
  }

  tooltipDescription(methodName: string, keyBinding: KeyBinding) {
    return `Press [${
      Array.from(keyBinding).join('+').toLocaleUpperCase().replace('ARROW', '')
    }] key to go to ${this.tag._tagname}`;
  }

}
