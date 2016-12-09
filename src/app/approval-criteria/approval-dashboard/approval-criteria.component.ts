import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { ApprovalCriteriaService } from '../shared/approval-criteria.service';
import { UserService } from '../../user/shared/user.service';
import { CompanyService } from '../../companies/shared/company.service';
import { AccountService } from '../../account/shared/account.service';
import { LedgerAccountService } from '../../ledger-account/shared/ledger-account.service';

import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { ApprovalFilterArguments } from './filter-bar.component';

import { CurrentPageArguments } from '../../pagination/pagination.component';


@Component({
  selector: 'sp-approval-criteria',
  templateUrl: './approval-criteria.component.html',
})

export class ApprovalCriteriaComponent extends BaseComponent implements OnInit {

  private companyId: number = 0;
  private totalItems: number = 0;
  private account: Object;
  private approvals: Array<ApprovalCriteriaModel>;
  private ledgerAccounts: Array<any> = [];
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _filteredValue: ApprovalFilterArguments = new ApprovalFilterArguments;
  private approvers: Array<any> = [];

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private companiesService: CompanyService,
    private accountService: AccountService,
    private ledgerAccountService: LedgerAccountService,
    private approvalCriteriaService: ApprovalCriteriaService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.approvals = new Array<ApprovalCriteriaModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }


  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }
  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getApprovalCriteria('all');
  }
  private get filteredValue(): ApprovalFilterArguments {
    return this._filteredValue;
  }
  private set filteredValue(newValue: ApprovalFilterArguments) {
    this._filteredValue = newValue;
    this.getApprovalCriteria(this._filteredValue.type);
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();

    if (this.user.userId && this.user.IsSuperUser) {
      this.getParameterValues();
    } else {
      let link = ['/dashboard'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      this.companyId = parseInt(params['companyId']);
      if (this.companyId === 0) {
        this.getAccountName();
      } else {
        this.getCompanyName();
      }
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getLedgerAccounts();
    });
  }

  private getCompanyName(): void {
    this.location.replaceState('approvals/' + this.companyId);
    this.companiesService.getCompanyName(this.companyId).then(result => {
      this.getApprovers();
      // this.cmpName = result.data.replace(/"/g, '');
    });
  }

  private getApprovers(): void {
    this.userService.getApproverUserDDOs(this.companyId).then(result => {
       this.approvers = result;
      // this.ApproversCount = this.approvers.length;
      // this.selectedApprover = [];
      // this.selectedApprover.selected = [];  
      this.getLedgerAccounts();
    });
  }

  private getLedgerAccounts(): void {
    this.ledgerAccountService.getLedgerAccountDDOsAccountTypeWise(this.companyId).then(result => {
      //this.ledgerAccounts = result;
      // this.selectedLedgerAccount.selected = [];
      this.getApprovalCriteria('all');
    });
  }

  private getApprovalCriteria(approvalType): void {
    this._filteredValue.type = approvalType;
    this.approvals = [];
    this.approvalCriteriaService.getApprovalCriteria(
      approvalType,
      this.companyId,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result.status === 404) {
          this.approvals = [];
        } else {
          this.approvals = result;
          this.totalItems = this.approvals[0].ApprovalCount;
        }
      });
  }

  private deleteApprovalCriteria(approvalCriteriaID): void {
    if (confirm('Are you sure you would like to destroy this approval criteria?') === true) {
      this.approvalCriteriaService.deleteApprovalCriteria(approvalCriteriaID).then(result => {
        // alert("Approval criteria successfully destroyed.");
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
