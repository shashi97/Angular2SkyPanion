import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from '../../base.component';

import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { LedgerAccountModel } from '../shared/ledger-account.model';
import { UserService } from '../../user/shared/user.service';
import { AccountService } from '../../account/shared/account.service';
import { LedgerAccountService } from '../shared/ledger-account.service';

import { LedgerFilterArguments } from './filter-bar.component'
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'sp-ledger-account',
  templateUrl: './ledger-account.component.html',
})

export class LedgerAccountComponent extends BaseComponent implements OnInit ,AfterViewInit {

  private pageName: string = 'Ledger Account';
  private showLoader:boolean;
  private totalItems: number = 0;
  private account: Object;
  private companyId: number = 0;
  private searchString: string = '';

  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _filteredValue: LedgerFilterArguments = new LedgerFilterArguments();

  private ledgerAccounts: Array<LedgerAccountModel>;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private accountService: AccountService,
    private ledgerAccountService: LedgerAccountService,
    private location: Location,
    public pubsub: PubSubService  
  ) {
    super(localStorageService, router);
    this.ledgerAccounts = new Array<LedgerAccountModel>();
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

  

  private get filteredValue(): LedgerFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: LedgerFilterArguments) {
    this._filteredValue = newValue;

    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.accountNumberSearch + ','
      + this.filteredValue.accountTitleSearch;

    this.getLedgerAccounts();
  }


  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.accountNumberSearch + ','
      + this.filteredValue.accountTitleSearch;
    this.getLedgerAccounts();
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;

  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let parameterValue: any = ((params) ? params : 1);
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');
        this.filteredValue.accountNumberSearch = parameterArray[0];
        this.filteredValue.accountTitleSearch = parameterArray[1];
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.filteredValue.accountNumberSearch + ','
        + this.filteredValue.accountTitleSearch;

      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then((result) => {
      this.account = result;
      this.getLedgerAccounts();
    });
  }

  private getLedgerAccounts(): void {

    this.location.replaceState('ledgerAccount/' + this.searchString);

    this.ledgerAccountService.getLedgerAccounts(
      this.filteredValue.accountNumberSearch,
      this.filteredValue.accountTitleSearch,
      this.companyId,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter)
      .then((result) => {

        if (result.status === 404) {
          this.ledgerAccounts = [];
        } else {
          this.ledgerAccounts = result;
          if (this.ledgerAccounts[0] !== undefined) {
            if (this.ledgerAccounts[0].TotalCount !== undefined) {
              this.totalItems = this.ledgerAccounts[0].TotalCount;
            }
          }
        }
        // var instanseId = paginationService.getLastInstanceId();
        // paginationService.setCurrentPage(instanseId, this.currentPage);
      });
  }


  public onFiltered(filteredValue: LedgerFilterArguments): void {
    this.filteredValue = filteredValue;
  }

}