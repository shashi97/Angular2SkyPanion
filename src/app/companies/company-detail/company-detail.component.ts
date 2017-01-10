import { Component, OnInit , AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '../shared/company.service';
import { CompanyModel } from '../shared/company.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../account/shared/account.service';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'sp-company',
  templateUrl: './company-detail.component.html',
})

export class CompanyDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  private companyId: number;
  private searchParameters: number;
  private showLoader:boolean;
  // private company: CompanyModel = new CompanyModel();
  private company: CompanyModel;
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public accountService: AccountService,
    private companyService: CompanyService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
     this.company = new CompanyModel();
  }

  ngOnInit() {
    
  }

    ngAfterViewInit()
    {
       setTimeout(() => {
           this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
           this.pubsub.afterRequest.subscribe(data => this.showLoader = false);

         if (this.user) {
      this.getParameterValue();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
    }, 1);
  }

 

  private getParameterValue(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.searchParameters = +params['SearchParameters'];
    });
    this.getComapnyDetail();
  }

  private getComapnyDetail(): void {
    this.companyService.getCompanyDetail(this.companyId).then(result => {
      this.company = result;
    });
  }
}


