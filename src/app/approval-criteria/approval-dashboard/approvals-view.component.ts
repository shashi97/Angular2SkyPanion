import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
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
    private showApprovalCriteria(data, type, isNew) {

        const builder = new BSModalContextBuilder<ApprovalContext>(
            { data: data, Type: type, isNew: isNew, approvals: this.approvals } as any,
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
              //  this.getIniSetupDetails();
            });
    }
}
