import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserDropdownComponent } from '../../shared/dropdown/user/user-dropdown.component';

// import { SyncBatchModel } from '../shared/sync-batch.model';
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

export class SyncBatchFilterComponent extends BaseComponent implements OnInit {

  private totalItems: number = 0;
  @Input() syncBatchFilteredValue: SyncBatchFilteredArgs = new SyncBatchFilteredArgs();
  @Output() filteredsyncBatch: EventEmitter<SyncBatchFilteredArgs> = new EventEmitter<SyncBatchFilteredArgs>();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private searchUrl(): void {

this.filteredsyncBatch.emit(this.syncBatchFilteredValue);
  }

  private searchUrlReset(): void {

  }


}