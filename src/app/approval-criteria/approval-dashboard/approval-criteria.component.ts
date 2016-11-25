import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { ApprovalCriteriaService } from '../shared/approval-criteria.service'
import { UserService } from '../../user/shared/user.service';
import { CompaniesService } from '../../companies/shared/companies.service';
import { AccountService } from '../../account/shared/account.service';
import { LedgerAccountService } from '../../ledger-account/shared/ledger-account.service';

import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { ApprovalFilterArguments } from './filter-bar.component';


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
  private approvals: Array<ApprovalCriteriaModel>;
  private ledgerAccounts: Array<any> = [];
  private _filteredValue: ApprovalFilterArguments = new ApprovalFilterArguments;

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
    this.approvals = new Array<ApprovalCriteriaModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }


  private get filteredValue(): ApprovalFilterArguments {
    return this._filteredValue;
  }
  private set filteredValue(newValue: ApprovalFilterArguments) {
    this._filteredValue = newValue;
    this.getApprovalCriteria(this._filteredValue.type);
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
    this._filteredValue.type = approvalType;
    this.approvals = [];
    this.approvalCriteriaService.getApprovalCriteria(
      approvalType,
      this.companyId,
      this.currentPage,
      this.pageSize)
      .then((result) => {
        this.approvals = result;
        this.totalItems = this.approvals[0].ApprovalCount;
      });
  }

  deleteApprovalCriteria(approvalCriteriaID) {
    if (confirm("Are you sure you'd like to destroy this approval criteria?") == true) {
      this.approvalCriteriaService.deleteApprovalCriteria(approvalCriteriaID).then(result => {
        //alert("Approval criteria successfully destroyed.");
        // messageService.showMsgBox("Approval Criteria", "Approval criteria successfully destroyed.", "success");
        this._filteredValue.type = 'all';
        this.getApprovalCriteria(this._filteredValue.type);
      });
    }
  }

  private onFiltered(filteredValue: ApprovalFilterArguments): void {
    this.filteredValue = filteredValue;
  }
}