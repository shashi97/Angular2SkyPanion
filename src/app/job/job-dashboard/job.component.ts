import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';
// import { AccountModel} from '../../account/shared/account.model';
import { JobsService } from '.././shared/jobs.service';
import { JobModel } from '.././shared/job.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import {CurrentPageArguments} from '../../pagination/pagination.component';


import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-jobs',
  templateUrl: './job.component.html',
  providers: [JobsService, AccountService]
})
export class JobComponent extends BaseComponent implements OnInit {
  private account: Object;
  private jobs: Array<any>;
  private job: JobModel;
  private totalItems: number;
  // public currentPage: number = 1;

  // public totalItems: number = 200; // total numbar of page not items 
  // private maxSize: number = 2;
  // private itemsPerPageList: Array<number> = [];
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

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
    this.jobs = new Array<any>();
    this.job = new JobModel();

    this.getItemsPerPageList();

  }
  ngOnInit(): void { }

  public pageChanged(event: any): void {
    // this method will trigger every page click  
    console.log('Number items per page: ' + event.itemsPerPage);
  };


  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }
  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
     this.getJobs();
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }
  // public onPageSizeFilterChanged(pageSize: number) {
  //   this.pageSizeFilter = pageSize;
  //   this.getJobs();
  // }

  private getItemsPerPageList() {
    //  this.itemsPerPageList = this.masterService.getItemsPerPageList();
    // this.pageSize = 25;
    // this.pageSizeFilter = 25;
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
      this.account = result;
      this.getJobs();
    });
  }
  private getJobs(): void {
    this.jobsService
      .getJobs(this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        // if (result.status == 404) {
        //     $scope.gridData = [];
        //     $scope.totalItems = 0;
        // }
        // else if (result.status == 500) {
        // }
        // else {
        this.jobs = result;
        if (this.jobs && this.jobs.length > 0) {
          this.totalItems = this.jobs[0].TotalCount;
        } else {
          this.totalItems = 0;
        }
        // this.changeDetectorRef.markForCheck();
        //   this.setPage(this.jobs.length);

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
