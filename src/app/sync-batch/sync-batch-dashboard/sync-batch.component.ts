import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Location } from '@angular/common';

import { Router } from '@angular/router';
import { SyncBatchModel } from '../shared/sync-batch.model';
import { SyncBatchFilteredArgs } from './filter-bar.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';
import { SyncBatchService } from '../shared/sync-batch.service';

@Component({
  selector: 'sp-sync-batch',
  templateUrl: './sync-batch.component.html',
})

export class SyncBatchComponent extends BaseComponent implements OnInit {

  private searchString: string = '';
  private totalItems: number = 0;
  private userId: number = 0;
  private account: Object;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private syncBatchs: Array<SyncBatchModel>;
  private _currentSyncBatchArgs: SyncBatchFilteredArgs = new SyncBatchFilteredArgs();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private syncBatchService: SyncBatchService,
    private location: Location
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
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
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.syncBatchFilteredValue.syncFromDate + ','
      + this.syncBatchFilteredValue.syncToDate + ','
      + this.syncBatchFilteredValue.batchNumber + ','
      + this.syncBatchFilteredValue.userId;
    this.getSyncBatches();
  }

  private get syncBatchFilteredValue(): SyncBatchFilteredArgs {
    return this._currentSyncBatchArgs;
  }

  private set syncBatchFilteredValue(newValue: SyncBatchFilteredArgs) {
    this._currentSyncBatchArgs = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.syncBatchFilteredValue.syncFromDate + ','
      + this.syncBatchFilteredValue.syncToDate + ','
      + this.syncBatchFilteredValue.batchNumber + ','
      + this.syncBatchFilteredValue.userId;
    this.getSyncBatches();
  }


  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.syncBatchFilteredValue.syncFromDate = parameterArray[0];
        this.syncBatchFilteredValue.syncToDate = parameterArray[1];
        this.syncBatchFilteredValue.batchNumber = parameterArray[2];
        this.syncBatchFilteredValue.userId = Number(parameterArray[3]);
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.syncBatchFilteredValue.syncFromDate + ','
        + this.syncBatchFilteredValue.syncToDate + ','
        + this.syncBatchFilteredValue.batchNumber + ','
        + this.syncBatchFilteredValue.userId;

      this.getAccountName();
    });
  }


  getAccountName() {
    this.accountService.getAccountName().then(result => {
      if (result.status === 404 || result.status === 500) {
      } else {
        this.account = result;
        this.getSyncBatches();
      }
    });
  }

  getSyncBatches() {

    this.location.replaceState('syncBatch/' + this.searchString);

    let searchCriteriaSyncBatches = {
      syncFromDate: this._currentSyncBatchArgs.syncFromDate,
      syncToDate: this._currentSyncBatchArgs.syncToDate,
      userId: this._currentSyncBatchArgs.userId,
      batchNumber: this._currentSyncBatchArgs.batchNumber,
      currentPage: this._currentPage.pageNo,
      pageSize: this._currentPage.pageSizeFilter
    };

    this.syncBatchService.getSyncBatches(searchCriteriaSyncBatches).then(result => {
      if (result.status === 404) {
        this.syncBatchs = new Array<SyncBatchModel>();
        this.totalItems = 0;
      } else if (result.status === 500) {
      } else {
        this.syncBatchs = result;
        this.totalItems = this.syncBatchs[0].SyncBatchCount;
      }
    });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  public onfilteredsyncBatch(filteredValue: SyncBatchFilteredArgs): void {
    this.syncBatchFilteredValue = filteredValue;
  }

}
