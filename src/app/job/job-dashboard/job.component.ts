import { Component, OnInit  ,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';
import { JobsService } from '.././shared/jobs.service';
import { JobModel } from '.././shared/job.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-jobs',
  templateUrl: './job.component.html'
})

export class JobComponent extends BaseComponent implements OnInit , AfterViewInit {
  private showLoader:boolean;
  private account: Object;
  private jobs: Array<JobModel>;
  private job: JobModel;
  private totalItems: number;
  private sorting: any = {
    column: 'Number', //to match the variable of one of the columns
    descending: false
  };

  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public jobsService: JobsService,
    public masterService: MasterService,
    private route: ActivatedRoute,
    private location: Location,
     public toastr: ToastsManager,
     public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.jobs = new Array<JobModel>();
    this.job = new JobModel();
  }

 ngOnInit(): void {
   
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   ngAfterViewInit(){
      if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

   convertSorting() {
    return this.sorting.descending ? '-' + this.sorting.column : this.sorting.column;
  }

  selectedClass(columnName) {
    return columnName == this.sorting.column ? 'sort-' + this.sorting.descending : false;
  }

  changeSorting(columnName): void {
    var sort = this.sorting;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }


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
        if (result.status === 404) {
          // this.jobs = new Array<JobModel>();
          // this.totalItems = 0;
          this.toastr.error('There is no data availablity', 'Oops!');
        } else if (result.status === 500) {
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
}
