import { Component, OnInit, Input, ViewContainerRef , Output, EventEmitter} from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { ApprovalContext, ApprovalModalComponent } from './approval-criteria.modal';

import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';

@Component({
    selector: 'sp-approvals-view',
    templateUrl: './approvals-view.component.html',
})

export class ApprovalsViewComponent extends BaseComponent implements OnInit {

    @Input() approvals: Array<ApprovalCriteriaModel>;
    @Input() companyId:number;
    @Input() approvers:Array<any>;
    @Output() approvalCreteriaChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        vcRef: ViewContainerRef,
        overlay: Overlay,
        public modal: Modal
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
    private showApprovalCriteria(data, typeData, isNew) {

        const builder = new BSModalContextBuilder<ApprovalContext>(
            { data: data,
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
}
