import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChartSpecService } from 'src/app/chart-spec.service';
import { SpecTag } from 'src/app/chart-structure/chart-spec/spec-tag';
import { ChartSpec } from 'src/app/chart-structure/chart-spec/chart-spec';

@Component({
  selector: 'app-chart-spec-tree-view-add-annotation',
  templateUrl: './chart-spec-tree-view-add-annotation.component.html',
  styleUrls: ['./chart-spec-tree-view-add-annotation.component.scss']
})
export class ChartSpecTreeViewAddAnnotationComponent implements OnInit {
  currentTag: SpecTag;
  chartSpec: ChartSpec;

  modalCloseResult: string = '';

  annotationOptions = [ 'Note', 'Highlight' ];

  constructor(
      private modalService: NgbModal,
      private chartSpecService: ChartSpecService,
    ) { }

  ngOnInit() {
    this.chartSpecService.bindChartSpec(this);
  }

  open(content) {
    this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false, // TODO: enable it and resolve CSS problem
        backdropClass: 'add-annotation',
        windowClass: 'add-annotation',
        container: '#add-annotation-modal-container'
      })
      .result.then((result) => {
        this.chartSpec.annotations.addAnnotation(result);
      }, (reason) => {
        this.modalCloseResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
