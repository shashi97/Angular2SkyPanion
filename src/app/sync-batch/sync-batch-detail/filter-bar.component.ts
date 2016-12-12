import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'sp-sync-batch-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class SyncBatchDetailFilterComponent extends BaseComponent implements OnInit {

  private totalItems: number = 0;

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }



}
