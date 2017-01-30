import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import {  ApprovalModalComponent } from './approval-criteria.modal';
import { ApprovalCriteriaModel, ApprovalContext, ApproversModel } from '../shared/approval-criteria.model';

export class ApprovalFilterArguments {
  type: string = '';
}

@Component({
  selector: 'sp-approval-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class ApprovalFilterComponent extends BaseComponent implements OnInit {

  @Output() filtered: EventEmitter<ApprovalFilterArguments> = new EventEmitter<ApprovalFilterArguments>();
  @Input() filteredValue: ApprovalFilterArguments = new ApprovalFilterArguments();
  @Input() approvals: Array<ApprovalCriteriaModel>;
  @Input() companyId: number;
  @Input() approversCount: number;
  @Input() approvers: Array<ApproversModel>;
  @Input() cmpName: string;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    vcRef: ViewContainerRef,
    overlay: Overlay,
    public modal: Modal
  ) {
    super(localStorageService, router);
     overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  getApprovalCriteria(type) {
    this.filteredValue.type = type;
    this.filtered.emit(this.filteredValue);
  }

  private showApprovalCriteria(approvalDetail, typeData, isNew) {

    const builder = new BSModalContextBuilder<ApprovalContext>(
      {
        approvalDetail: approvalDetail,
        type: typeData,
        isNew: isNew,
        approvals: this.approvals,
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
              if (result) {
                this.getApprovalCriteria('all');
              }
             // this.getIniSetupDetails();
            }, () => console.log(' Error In init-setup form modal '));
        });
  }
}
