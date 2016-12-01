import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { SyncBatchService } from '../shared/sync-batch.service';
import { SyncBatchModel } from '../shared/sync-batch.model';

@Component({
  selector: 'sp-sync-batch-detail',
  templateUrl: './sync-batch-detail.component.html',
})

export class SyncBatchDetailComponent extends BaseComponent implements OnInit {

  private totalItems: number = 0;
  private syncBatcheId: number = 0;
  private syncBatcheDetail: SyncBatchModel;
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private syncBatchService: SyncBatchService,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.getParameterValues();
  }

  ngOnInit() {
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.syncBatcheId = params['syncBatchId'];
      this.getSyncBatcheDetail();
    });
  }

  getSyncBatcheDetail() {

    this.syncBatchService.getSyncBatcheDetail(this.syncBatcheId).then(result => {
      if (result.status == 404) {
        // messageService.showMsgBox("Sync Batche Detail", "Invalid sync batche.", "error");
        // $location.path('/syncbatchesList/' + $scope.pageSizeFilter + "/" + $scope.searchParameters);
      } else if (result.status == 500) {
      } else {
        this.syncBatcheDetail = result;
        if (this.syncBatcheDetail) {
          this.totalItems = this.syncBatcheDetail.SyncBatcheInvoices.length;
        }
      }
    });
  }

}