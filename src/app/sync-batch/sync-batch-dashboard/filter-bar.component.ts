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
  batchNumber: string = '';
  userId: number = 0;
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
    let dateTo = jQuery('#syncToDate').datepicker({ dateFormat: 'MM/DD/YYYY' });
    this.syncBatchFilteredValue.syncToDate = dateTo.val();
    this.syncBatchFilteredValue.userId = this.userFilteredArg.UserID;
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
