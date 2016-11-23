import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { MasterService } from '../shared/services/master/master.service';
import { AccountService } from '../account/shared/account.service';
import { AccountModel} from '../account/shared/account.model';
import { JobsService } from './shared/jobs.service';
import { JobsModel } from './shared/jobs.model';
import { UserService } from '../user/shared/user.service';
import { BaseComponent } from '../base.component';

import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-jobs',
  templateUrl: './jobs.component.html',
  providers: [JobsService, AccountService]
})
export class JobsComponent extends BaseComponent implements OnInit {
  private pageSize: number = 25;
  private pageSizeFilter: number;
  private accountModel: AccountModel = new AccountModel();
  private jobsModel: JobsModel = new JobsModel();
  public currentPage: number = 1;
  public totalItems: number = 200; // total numbar of page not items 
  private maxSize: number = 2;
  private itemsPerPageList: Array<number> = [];
  private _currentPageNo: number = 1;
  options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    columns: [
      new TableColumn({ name: 'Number', prop: 'Number' }),
      new TableColumn({ name: 'Company', prop: 'CompanyName' }),
      new TableColumn({ name: 'Description', prop: 'Description' }),
      new TableColumn({ name: 'Talent Id ', prop: 'TenantId' })
    ]
  });

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public jobsService: JobsService,
    public masterService: MasterService
  ) {
    super(localStorageService, router);
    this.getItemsPerPageList();

  }
  ngOnInit(): void { }

  public pageChanged(event: any): void {
    // this method will trigger every page click  
    console.log('Number items per page: ' + event.itemsPerPage);
  };


  public onCurrentPageChanged(newValue: number) {
    this._currentPageNo = newValue;
  }
  public onPageSizeFilterChanged(pageSize: number, maxPageNo: number) {
    console.log(pageSize);
  }

  private getItemsPerPageList() {
    this.itemsPerPageList = this.masterService.getItemsPerPageList();
    this.pageSize = 25;
    this.pageSizeFilter = 25;
    this.getSessionDetails();

  }
  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getAccountName();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }
  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.accountModel = result;
      this.getJobs();
    });
  }
  private getJobs(): void {
    // if ($scope.pageSizeFilter != null) {
    //             $scope.pageSize = $scope.pageSizeFilter;
    //         }
    this.jobsService
      .getJobs(this.currentPage, this.pageSize)
      .then(result => {
        // if (result.status == 404) {
        //     $scope.gridData = [];
        //     $scope.totalItems = 0;
        // }
        // else if (result.status == 500) {
        // }
        // else {
        this.jobsModel.jobsDetail = result;
        // this.changeDetectorRef.markForCheck();
        // this.setPage(this.jobsModel.jobsDetail.length);

        // $scope.totalItems = $scope.gridData[0].TotalCount;
        // }
      });
  }


  // private pageChangeHandler(): void {
  //   this.getJobs();
  // };

  // private getDataAsPerPerPageRequired(value: number): void {
  //   if (value !== undefined && value !== null) {
  //     this.pageSizeFilter = value;
  //     this.currentPage = 1;
  //     this.getJobs();
  //     // var instanseId = paginationService.getLastInstanceId();
  //     // paginationService.setCurrentPage(instanseId, this.currentPage);
  //   }
  // }

}
