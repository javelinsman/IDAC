import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { SpeakingService } from 'src/app/speaking.service';

@Component({
  selector: 'app-chart-spec-tree-view-bar-utils',
  templateUrl: './chart-spec-tree-view-bar-utils.component.html',
  styleUrls: ['./chart-spec-tree-view-bar-utils.component.scss']
})
export class ChartSpecTreeViewBarUtilsComponent implements OnInit, AfterContentChecked {
  @Input() tag: SpecTag;
  @Input() currentTag: SpecTag;
  @Input() siblingLength: number;
  @Input() isCollapsed: boolean;
  @Input() _collapseToggle: any;
  @Input() edit: boolean;
  @Input() viewOnly: boolean;

  constructor(
    private speakingService: SpeakingService
  ) { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    if (this.tag !== this.currentTag) {
      this.edit = false;
    }
  }

  play() {
    this.speakingService.read(this.tag.describe(), this.tag);
  }

  get speaking() {
    return this.speakingService.isSpeaking
      && this.speakingService.tagReading === this.tag;
  }

  stop() {
    this.speakingService.stop();
  }

}
