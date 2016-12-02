import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

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
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
