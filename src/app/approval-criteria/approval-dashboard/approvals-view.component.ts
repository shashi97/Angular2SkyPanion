import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { ApprovalModalComponent } from './approval-criteria.modal';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { ApprovalCriteriaService } from '../shared/approval-criteria.service';
import { ApprovalCriteriaModel, ApprovalContext } from '../shared/approval-criteria.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
import {
  confirmationModalContext,
  confirmationModalComponent
} from '../../shared/confirmation-modal/confirmation-modal.component';

import 'jquery';
declare let jQuery: any;


@Component({
  selector: 'sp-approvals-view',
  templateUrl: './approvals-view.component.html',
})

export class ApprovalsViewComponent extends BaseComponent implements OnInit {
    
  private sorting: any = {
    column: 'CompanyName', //to match the variable of one of the columns
    descending: false
  };
  private showLoader:boolean;
  @Input() approvals: Array<ApprovalCriteriaModel>;
  @Input() companyId: number;
  @Input() approvers: Array<any>;
  @Input() approversCount: number;
  @Output() approvalCreteriaChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() cmpName: string;
  private approvalListForUpdate: Array<any> = [];
  private newWeightCount: number = 0;
  private header:string =""

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    vcRef: ViewContainerRef,
    overlay: Overlay,
    public modal: Modal,
    public pubsub: PubSubService,
    public confirmService: ConfirmService,
    public approvalCriteriaService: ApprovalCriteriaService,
    public toastr: ToastsManager,
    private dragulaService: DragulaService

  ) {
    super(localStorageService, router);
    overlay.defaultViewContainer = vcRef;
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
  }

  private onDrag(args) {
    // let [e, el] = args;
  }

  private onDrop(args) {
    // let [e, el] = args;
    this.sortApprovalCriteriaList();
  }


  ngOnInit() {
    this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
    this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }
  

  private showApprovalCriteria(approvalDetail, typeData, isNew) {

    const builder = new BSModalContextBuilder<ApprovalContext>(
      {
        approvalDetail: approvalDetail,
        type: typeData,
        isNew: isNew,
        companyId: this.companyId,
        approvers: this.approvers,
        approversCount: this.approversCount,
        cmpName: this.cmpName
      } as any,
      undefined,
      ApprovalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };
    const dialog = this.modal.open(ApprovalModalComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        if (result != null) {
          this.approvalCreteriaChanged.emit();
        }
      }, () => console.log(' Error In approval form modal '));
    });
  }

    deleteApprovalModal(ApprovalCriteriaID) {
      this.header = "Are you sure you'd like to destroy this approval criteria?";
    const builder = new BSModalContextBuilder<confirmationModalContext>(
      { header: this.header } as any,
      undefined,
      confirmationModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(confirmationModalComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result === "true") {
          this.deleteApprovalCriteria(ApprovalCriteriaID);
        }
      }, () => console.log(' user canceled logout modal '));
    });


  }

  private deleteApprovalCriteria(ApprovalCriteriaID): void {
      this.approvalCriteriaService.deleteApprovalCriteria(ApprovalCriteriaID).then((result) => {
        if (result.status === 404 || result.status === 500) {
          this.toastr.error(result.data.ExceptionMessage, 'Oops!');
          // messageService.showMsgBox("Error", result.data.ExceptionMessage, "error");
        } else {
          this.toastr.success('Approval criteria successfully destroyed.', 'Success!');
          this.approvalCreteriaChanged.emit();
          // messageService.showMsgBox("Success", "Role successfully deleted.", "success");
        }
      });
  }

  private sortApprovalCriteriaList(): void {
    if (this.approvals) {
      this.newWeightCount = 0;
      this.approvalListForUpdate = [];
      for (let i = 0; i < this.approvals.length; i++) {
        let obj = {
          ApprovalCriteriaID: this.approvals[i].ApprovalCriteriaID,
          Weight: this.newWeightCount++,
          CompanyID: this.approvals[i].CompanyID
        };
        this.approvalListForUpdate.splice(this.approvalListForUpdate.length, 0, obj);
      }
      this.approvalCriteriaService.updateApprovers(this.approvalListForUpdate).then(result => {
      });
    }
  }

  convertSorting() {
    return this.sorting.descending ? '-' + this.sorting.column : this.sorting.column;
  }

  selectedClass(columnName) {
    return columnName == this.sorting.column ? 'sort-' + this.sorting.descending : false;
  }

  changeSorting(columnName): void {
    var sort = this.sorting;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }

  
}
