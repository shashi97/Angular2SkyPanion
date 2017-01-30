import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { UserFilterArguments } from '../../shared/dropdown/user/user-dropdown.component';

import * as moment from 'moment/moment';
declare let jQuery: any;

export class SyncBatchFilteredArgs {
  syncFromDate: string = '';
  syncToDate: string = '';
  batchNumber: string ='';
  userId: number = -1;
  datefURL: Date;
  datetURL: Date;
}

@Component({
  selector: 'sp-sync-batch-filter',
  templateUrl: './filter-bar.component.html',
})

export class SyncBatchFilterComponent extends BaseComponent implements OnInit, OnChanges {
  private totalItems: number = 0;
  @Input() syncBatchFilteredValue: SyncBatchFilteredArgs = new SyncBatchFilteredArgs();
  @Output() filteredsyncBatch: EventEmitter<SyncBatchFilteredArgs> = new EventEmitter<SyncBatchFilteredArgs>();
  private _userFilteredValue: UserFilterArguments = new UserFilterArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    jQuery('#syncFromDate').datepicker();
    jQuery('#syncToDate').datepicker();
  }

  ngOnChanges() {
    this.userFilteredArg.UserID = this.syncBatchFilteredValue.userId;
  }


  private get userFilteredArg(): UserFilterArguments {
    return this._userFilteredValue;
  }

  private set userFilteredArg(newValue: UserFilterArguments) {
    this._userFilteredValue = newValue;

  }

  private searchUrl(): void {
    let dateFrom = jQuery('#syncFromDate').datepicker({ dateFormat: 'MM/DD/YYYY' });
    this.syncBatchFilteredValue.syncFromDate = dateFrom.val();

    if(this.syncBatchFilteredValue.syncFromDate !==  undefined && this.syncBatchFilteredValue.syncFromDate !==  ''){
      this.syncBatchFilteredValue.datefURL = moment(dateFrom.val(), 'MM/DD/YYYY').toDate();
    }

    let dateTo = jQuery('#syncToDate').datepicker({ dateFormat: 'MM/DD/YYYY' });
    this.syncBatchFilteredValue.syncToDate = dateTo.val();

     if(this.syncBatchFilteredValue.syncToDate !==  undefined && this.syncBatchFilteredValue.syncToDate !==  ''){
       this.syncBatchFilteredValue.datetURL = moment(dateTo.val(), 'MM/DD/YYYY').toDate();
    }

    this.syncBatchFilteredValue.userId = this.userFilteredArg.UserID;
    if(this.syncBatchFilteredValue.batchNumber === ''){
      this.syncBatchFilteredValue.batchNumber = null;
    }
    this.filteredsyncBatch.emit(this.syncBatchFilteredValue);
  }

  private searchUrlReset(): void {
    jQuery('#syncFromDate').val('');
    jQuery('#syncToDate').val('');
    this.syncBatchFilteredValue = new SyncBatchFilteredArgs();
    this.userFilteredArg = new UserFilterArguments();
    this.filteredsyncBatch.emit(this.syncBatchFilteredValue);
  }

  public onUserFiltered(filteredValue: UserFilterArguments): void {
    this.userFilteredArg = filteredValue;
  }

}
