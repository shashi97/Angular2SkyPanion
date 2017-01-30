import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { SyncBatchService } from '../shared/sync-batch.service';
import { UserService } from '../../user/shared/user.service';

import { SyncBatchModel } from '../shared/sync-batch.model';
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
@Component({
  selector: 'sp-sync-batch-detail',
  templateUrl: './sync-batch-detail.component.html',
})

export class SyncBatchDetailComponent extends BaseComponent implements OnInit {
  private showLoader:boolean;
  private totalItems: number = 0;
  private syncBatcheId: number = 0;
  private syncBatcheDetail: SyncBatchModel;
  private searchString: string = '';
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private syncBatchService: SyncBatchService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    // this.getSessionDetails();
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

  // private getSessionDetails(): void {
  //   this.sessionDetails = this.userService.getSessionDetails();
  //   if (this.sessionDetails.userId != null) {
  //     this.getParameterValues();
  //   } else {
  //     let link = ['/login'];
  //     this.router.navigate(link);
  //   }
  // }


  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];
      this.syncBatcheId = Number(params['id']);

      this.searchString = this.syncBatcheId + '/' + pageSizeFilter + '/' + searchParameters;

      this.getSyncBatcheDetail();
    });
  }

  getSyncBatcheDetail() {
   this.location.replaceState('syncBatch/detail/' + this.searchString);
   return new Promise((resolve, reject) => {
    this.syncBatchService.getSyncBatcheDetail(this.syncBatcheId).then(result => {
      if (result.status === 404) {
        // messageService.showMsgBox("Sync Batche Detail", "Invalid sync batche.", "error");
        // $location.path('/syncbatchesList/' + $scope.pageSizeFilter + "/" + $scope.searchParameters);
      } else if (result.status === 500) {
      } else {
        this.syncBatcheDetail = result;
        if (this.syncBatcheDetail) {
          this.totalItems = this.syncBatcheDetail.SyncBatcheInvoices.length;
        }
      }
    });
   });
  }
}
