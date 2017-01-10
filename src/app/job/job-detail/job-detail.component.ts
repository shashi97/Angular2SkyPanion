import { Component, OnInit , AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { AccountService } from '../../account/shared/account.service';
import { JobsService } from '.././shared/jobs.service';
import { JobModel } from '.././shared/job.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'sp-jobs',
  templateUrl: './job-detail.component.html',
  providers: [JobsService, AccountService]
})
export class JobDetailComponent extends BaseComponent implements OnInit , AfterViewInit {

  private showLoader:boolean;
  private jobId: number;
  private jobDetail: JobModel;
  private currentPage: number = 1;
  private pageSize: number = 25;
  selectedCity: any;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public jobsService: JobsService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.jobDetail = new JobModel();
  }

  ngOnInit(): void {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }


  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = +params['id'];
    });
    if (this.user) {
      this.getJobById();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getJobById(): void {
    this.jobsService.getJobById(this.jobId, this.currentPage, this.pageSize).then((result) => {
      this.jobDetail = result;
    });
  }
}
