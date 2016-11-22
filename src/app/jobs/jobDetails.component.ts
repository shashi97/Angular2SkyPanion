import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { AccountService } from '../account/shared/account.service';
import { AccountModel } from '../account/shared/account.model';
import { JobsService } from './shared/jobs.service';
import { JobsModel, JobDetails } from './shared/jobs.model';
import { UserService } from '../user/shared/user.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'sp-jobs',
  templateUrl: './jobDetails.component.html',
  providers: [JobsService, AccountService]
})
export class JobDetailsComponent extends BaseComponent implements OnInit {

  private jobId: number;
  jobDetails: JobDetails = new JobDetails();
  private currentPage: number = 1;
  private pageSize: number = 25;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public jobsService: JobsService
  ) {
    super(localStorageService, router);

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = +params['jobId'];

    });
    this.getSessionDetails();
  }
  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getJobById();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }

  }
  private getJobById(): void {
    this.jobsService.getJobById(this.jobId, this.currentPage, this.pageSize).then((result) => {

      //  if (result.status == 404) {
      //                     $scope.jobDetail = [];
      //                     $scope.totalItems = 0;
      //                 }
      //                 else if (result.status == 500) {
      //                 }
      //                 else {
      this.jobDetails = result;
      // $scope.totalItems = 0;
      // if ($scope.jobDetail.JobCategories.length > 0) {
      //     $scope.totalItems = $scope.jobDetail.JobCategories[0].TotalCount;
      // }
      //}


    });

  }



}
