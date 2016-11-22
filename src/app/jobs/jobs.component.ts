import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

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
  private accountModel: AccountModel= new AccountModel();
  private jobsModel: JobsModel= new JobsModel();
  private currentPage: number= 1;
  private pageSize: number= 25;
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
    public jobsService: JobsService
  ) {
    super(localStorageService, router);
    this.getItemsPerPageList();

  }
  ngOnInit(): void { }

  private getItemsPerPageList() {
    // $scope.itemsPerPageList = masterService.getItemsPerPageList();
    // $scope.pageSize = 25;
    // $scope.pageSizeFilter = 25;
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
                   // $scope.totalItems = $scope.gridData[0].TotalCount;
                // }
            });
  }

}
