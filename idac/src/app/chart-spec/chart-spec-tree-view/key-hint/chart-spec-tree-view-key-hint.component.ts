import { Component, OnInit, Input, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { keyBindings, KeyBindings, KeyBinding } from 'src/app/keyboard-input/key-bindings';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { NavigateComponent } from 'src/app/navigate/navigate.component';
import { firstLetterUpperCase } from 'src/app/utils';

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
            key: keyBinding.keyNameShort,
            tooltip: this.tooltipDescription(methodName, keyBinding)
          });
        }
      });
      this.reachableKeys = this.reachableKeys.slice(0, 5);
    }
  }

  tooltipDescription(methodName: string, keyBinding: KeyBinding) {
    return `[${keyBinding.keyName}] ${keyBinding.description}`;
  }

}
