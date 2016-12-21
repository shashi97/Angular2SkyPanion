import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '../shared/company.service';
import { CompanyModel } from '../shared/company.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../account/shared/account.service';

@Component({
  selector: 'sp-company',
  templateUrl: './company-detail.component.html',
})

export class CompanyDetailComponent extends BaseComponent implements OnInit {

  private companyId: number;
  private searchParameters: number;

  // private company: CompanyModel = new CompanyModel();
  private company: CompanyModel;
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public accountService: AccountService,
    private companyService: CompanyService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    if (this.user) {
      this.getParameterValue();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
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


