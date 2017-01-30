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
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
import * as moment from 'moment/moment';

@Component({
  selector: 'sp-sync-batch',
  templateUrl: './sync-batch.component.html',
})

export class SyncBatchComponent extends BaseComponent implements OnInit {
  private showLoader:boolean;
  private searchString: string = '';
  private totalItems: number = 0;
  private userId: number = 0;
  private account: Object;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private syncBatchs: Array<SyncBatchModel>;
  private _currentSyncBatchArgs: SyncBatchFilteredArgs = new SyncBatchFilteredArgs();
  private pageName: string = 'Invoice';
  private datefURL:string= '';
  private datetURL:string = '';
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private syncBatchService: SyncBatchService,
    private location: Location,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
	  
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
     if(this.syncBatchFilteredValue.datefURL !== undefined && this.syncBatchFilteredValue.datefURL !== null){
       this.datefURL =  this.syncBatchFilteredValue.datefURL.toDateString();
      }

      if(this.syncBatchFilteredValue.datetURL !== undefined && this.syncBatchFilteredValue.datetURL !== null){
       this.datetURL =  this.syncBatchFilteredValue.datetURL.toDateString();
      }

    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
    + this.datefURL + ','
      + this.datetURL + ','
      + this.syncBatchFilteredValue.batchNumber + ','
      + this.syncBatchFilteredValue.userId;
    this.getSyncBatches();
  }

  private get syncBatchFilteredValue(): SyncBatchFilteredArgs {
    return this._currentSyncBatchArgs;
  }

  private set syncBatchFilteredValue(newValue: SyncBatchFilteredArgs) {
    this._currentSyncBatchArgs = newValue;

 if(this.syncBatchFilteredValue.datefURL !== undefined && this.syncBatchFilteredValue.datefURL !== null){
       this.datefURL =  encodeURIComponent(this.syncBatchFilteredValue.datefURL.toDateString())
      }

      if(this.syncBatchFilteredValue.datetURL !== undefined && this.syncBatchFilteredValue.datetURL !== null){
       this.datetURL =  encodeURIComponent(this.syncBatchFilteredValue.datetURL.toDateString())
      }


    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
     + this.datefURL + ','
      + this.datetURL + ','
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

        if (parameterArray[0] !== undefined && parameterArray[0] !== '') {
             this.syncBatchFilteredValue.syncFromDate = moment(decodeURIComponent(parameterArray[0])).format('MM/DD/YYYY');
             this.syncBatchFilteredValue.datefURL = moment(parameterArray[0], 'MM/DD/YYYY').toDate();
        }

         if (parameterArray[1] !== undefined && parameterArray[1] !== '') {
             this.syncBatchFilteredValue.syncToDate = moment(decodeURIComponent(parameterArray[1])).format('MM/DD/YYYY');
             this.syncBatchFilteredValue.datetURL = moment((parameterArray[1]), 'MM/DD/YYYY').toDate();
        }

        if (parameterArray[2] !== undefined && parameterArray[2] !== 'null'){
           this.syncBatchFilteredValue.batchNumber = parameterArray[2];
        }else{
          this.syncBatchFilteredValue.batchNumber = '';
        }
        this.syncBatchFilteredValue.userId = Number(parameterArray[3]);
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + encodeURIComponent(this.syncBatchFilteredValue.syncFromDate) + ','
        + encodeURIComponent(this.syncBatchFilteredValue.syncToDate) + ','
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
    return new Promise((resolve, reject) => {
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
   });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  public onfilteredsyncBatch(filteredValue: SyncBatchFilteredArgs): void {
    this.syncBatchFilteredValue = filteredValue;
  }

  public getSyncBatchDetails(item) {
     let link = [];
        if (this.user) {
          link = ['/syncBatch/detail/' + item.SyncBatcheID + '/' +  this.searchString];
        } else {
          link = ['/login'];
        }
        this.router.navigate(link);

  }

}
