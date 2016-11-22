import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { ApprovalCriteriaService } from './shared/approval-criteria.service'
import { UserService } from '../user/shared/user.service';
import { CompaniesService } from '../companies/shared/companies.service';
import { AccountService } from '../account/shared/account.service';
import { LedgerAccountService } from '../ledger-account/shared/ledger-account.service';

import { ApprovalCriteriaModel } from './shared/approval-criteria.model';


@Component({
    selector: 'sp-approval-criteria',
    templateUrl: './approval-criteria.component.html',
})

export class ApprovalCriteriaComponent extends BaseComponent implements OnInit {

    private companyId: number = 0;
    private totalItems: number = 0;
    private account: Object;
    private pageSize: number = 25;
    private currentPage: number = 1;
    private approvalCriteriaModel: ApprovalCriteriaModel;
    private type: string = '';
    private ledgerAccounts: Array<any> = [];

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private companiesService: CompaniesService,
        private accountService: AccountService,
        private ledgerAccountService: LedgerAccountService,
        private approvalCriteriaService: ApprovalCriteriaService
    ) {
        super(localStorageService, router);
        this.approvalCriteriaModel = new ApprovalCriteriaModel();
        this.getSessionDetails();
    }

    ngOnInit() {
    }

    private getSessionDetails() {
        this.user = this.userService.getSessionDetails();

        if (this.user.userId != null) {
            if (this.user.IsSuperUser == true) {
                if (this.companyId == 0) {
                    this.getAccountName();
                }
                else {
                    this.getCompanyName();
                }
            }
            else {
                let link = ['/dashboard'];
                this.router.navigate(link);
            }

        }

    }

    private getAccountName(): void {
        this.accountService.getAccountName().then((result) => {
            this.account = result;
            this.getLedgerAccounts();
        });
    }

    private getCompanyName() {
        this.companiesService.getCompanyName(this.companyId).then((result) => {
            this.getApprovers();
            // this.cmpName = result.data.replace(/"/g, '');
        });
    }

    getApprovers() {
        this.userService.getApproverUserDDOs(this.companyId).then((result) => {
            // this.approvers = result.data;
            // this.ApproversCount = this.approvers.length;
            // this.selectedApprover = [];
            // this.selectedApprover.selected = [];
            this.getLedgerAccounts();
        });
    }

    private getLedgerAccounts() {
        this.ledgerAccountService.getLedgerAccountDDOsAccountTypeWise(this.companyId).then((result) => {
            this.ledgerAccounts = result;
            // this.selectedLedgerAccount.selected = [];
            this.getApprovalCriteria('all');
        });
    }

    private getApprovalCriteria(approvalType) {
        this.type = approvalType;
        this.approvalCriteriaService.getApprovalCriteria(
            approvalType,
            this.companyId,
            this.currentPage,
            this.pageSize)
            .then((result) => {
                this.approvalCriteriaModel.approvalCriteriaGridArray = result;
                this.totalItems = this.approvalCriteriaModel.approvalCriteriaGridArray[0].ApprovalCount;
            });
    }
}