import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel } from '../shared/sync-batch.model';

@Component({
  selector: 'sp-sync-batch-detail-attribute',
  templateUrl: './attribute.component.html',
})

export class SyncBatchDetailAttributeComponent extends BaseComponent implements OnInit {

  private totalItems: number = 0;
  @Input() syncBatcheDetail: SyncBatchModel;
  
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }



}
