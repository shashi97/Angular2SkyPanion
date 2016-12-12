import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { ApprovalContext, ApprovalModalComponent } from './approval-criteria.modal';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { ApprovalCriteriaService } from '../shared/approval-criteria.service';

import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
    selector: 'sp-approvals-view',
    templateUrl: './approvals-view.component.html',
})

export class ApprovalsViewComponent extends BaseComponent implements OnInit {

    @Input() approvals: Array<ApprovalCriteriaModel>;
    @Input() companyId: number;
    @Input() approvers: Array<any>;
    @Output() approvalCreteriaChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        vcRef: ViewContainerRef,
        overlay: Overlay,
        public modal: Modal,
        public confirmService: ConfirmService,
        public approvalCriteriaService: ApprovalCriteriaService,
        public toastr: ToastsManager
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
    private showApprovalCriteria(data, typeData, isNew) {

        const builder = new BSModalContextBuilder<ApprovalContext>(
            {
                data: data,
                type: typeData,
                isNew: isNew,
                approvals: this.approvals,
                companyId: this.companyId,
                approvers: this.approvers
            } as any,
            undefined,
            ApprovalContext
        );

        let overlayConfig: OverlayConfig = {
            context: builder.toJSON()
        };

        return this.modal.open(ApprovalModalComponent, overlayConfig)
            .catch(err => alert('ERROR'))
            .then(dialog => dialog.result)
            .then(result => {
                if (result != null) {
                    this.approvalCreteriaChanged.emit();
                    //  this.getApprovalCriteria(this.type); need to emit for parnt call
                }
                //  this.getIniSetupDetails();
            });
    }

    private deleteApprovalCriteria(ApprovalCriteriaID): void {
        let message = 'Are you sure you' + 'd like to destroy this approval criteria?';
        if (this.confirmService.confermMessage(message)) {
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

    }
}
