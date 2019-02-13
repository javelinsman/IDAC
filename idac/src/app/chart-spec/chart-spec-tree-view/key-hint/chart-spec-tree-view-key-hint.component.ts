import { Component, OnInit, Input, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { keyBindings, KeyBindings } from 'src/app/keyboard-input/key-bindings';
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

  keyBindings: KeyBindings = keyBindings;

  reachableKeys: string[];
  tooltipDescriptions: string[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    this.reachableKeys =[];
    this.tooltipDescriptions =[];
    if (this.tag === this.currentTag) {
      // this.reachableKeys.push('⏎');
    } else {
      Object.entries(this.keyBindings).forEach(([methodName, keyBinding]) => {
        this.navigateComponent.tag = this.currentTag;
        this.navigateComponent[methodName]();
        if(this.navigateComponent.tag === this.tag) {
          this.reachableKeys.push(this.shorten(Array.from(keyBinding).join('+')));
          this.tooltipDescriptions.push(this.tooltipDescription(methodName, keyBinding));
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

  tooltipDescription(methodName, keyBinding) {
    return `Press [${
      Array.from(keyBinding).join(' and ').toLocaleUpperCase().replace('ARROW', '')
    }] key to go to ${this.tag._tagname}`;
  }

}
