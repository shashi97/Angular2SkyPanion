import { Component, OnInit , AfterViewInit } from '@angular/core';
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

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { ApprovalFilterArguments } from './filter-bar.component';

import { ApprovalCriteriaModel, ApproversModel } from '../shared/approval-criteria.model';

import { CurrentPageArguments } from '../../pagination/pagination.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'sp-approval-criteria',
  templateUrl: './approval-criteria.component.html',
})

export class ApprovalCriteriaComponent extends BaseComponent implements OnInit , AfterViewInit {

  private showLoader:boolean;
  private companyId: number = 0;
  private totalItems: number = 0;
  private account: Object;
  private cmpName: string = '';
  private pageName: string = 'approvals';
  private approvals: Array<ApprovalCriteriaModel>;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _filteredValue: ApprovalFilterArguments = new ApprovalFilterArguments;
  private approvers: Array<ApproversModel> = [];
  private approversCount: number;

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
    private route: ActivatedRoute,
    public pubsub: PubSubService

  ) {
    super(localStorageService, router);
    this.approvals = new Array<ApprovalCriteriaModel>();
  }

  
 ngOnInit(): void {
   
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   ngAfterViewInit(){
      if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
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

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      this.companyId = Number(params['id']);
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
    this.location.replaceState('approval/' + this.companyId);
    this.companiesService.getCompanyName(this.companyId).then(result => {
      if (result.status === 404) {
       // this.cmpName = '';
      } else if (result.status === 500) {
      } else {
        this.cmpName = result._body.replace(/"/g, '');
      }
      this.getApprovers();
    });
  }

  private getApprovers(): void {
    this.userService.getApproverUserDDOs(this.companyId).then(result => {
      this.approvers = result;
      let defaultApprover = new ApproversModel();
      this.approvers.splice(0, 0, defaultApprover);
      this.approversCount = this.approvers.length - 1;
      this.getLedgerAccounts();
    });
  }

  private getLedgerAccounts(): void {
    this.ledgerAccountService.getLedgerAccountDDOsAccountTypeWise(this.companyId).then(result => {
      this.getApprovalCriteria('all');
    });
  }

  private getApprovalCriteria(approvalType) {
    this._filteredValue.type = approvalType;
    this.approvals = [];
    return new Promise((resolve, reject) => {
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
