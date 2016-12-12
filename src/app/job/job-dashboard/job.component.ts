import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';
import { JobsService } from '.././shared/jobs.service';
import { JobModel } from '.././shared/job.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';


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

  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public jobsService: JobsService,
    public masterService: MasterService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    super(localStorageService, router);
    this.jobs = new Array<any>();
    this.job = new JobModel();

    this.getSessionDetails();

  }
  ngOnInit(): void { }

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

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      let pageSizeFilter = params['pageSizeFilter'];

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }
      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getJobs();
    });
  }

  private getJobs(): void {
    this.location.replaceState('job/' + this.currentPageFiltered.pageSizeFilter);

    this.jobsService
      .getJobs(this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result) {
          this.jobs = [];
          this.totalItems = 0;
        } else if (result) {
        } else {
          this.jobs = result;
          if (this.jobs && this.jobs.length > 0) {
            this.totalItems = this.jobs[0].TotalCount;
          } else {
            this.totalItems = 0;
          }
        }
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
