import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserService } from '../../user/shared/user.service';
import { AccountService } from '../../account/shared/account.service';
import { CompaniesService } from '../../companies/shared/companies.service';
import { AchSetupService } from '../shared/ach-setup.service';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { AchSetupModel } from '../shared/ach-setup.model';

@Component({
  selector: 'sp-ach-setup',
  templateUrl: './ach-setup.component.html',
})

export class AchSetupComponent extends BaseComponent implements OnInit {

  private account: Object;
  private companyId: number = 0;
  private currentPage: number = 1;
  private pageSize: number = 25;
  private totalItems: number = 0;
  private achSetups: Array<AchSetupModel>;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private companiesService: CompaniesService,
    private achSetupService:AchSetupService
  ) {
    super(localStorageService, router);
    this.achSetups = new Array<AchSetupModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();

    if (this.user.userId != null && this.user.IsSuperUser == true) {
      if (this.companyId == 0) {
        this.getAccountName();
      } else {
        this.getCompanyName();
      }
    } else {
      let link = ['/company'];
      this.router.navigate(link);
    }
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getAchSetups();
    });
  }

  private getCompanyName(): void {
    this.companiesService.getCompanyName(this.companyId).then(result => {
      this.getAchSetups();
      // this.companyName = result.data.replace(/"/g, '');
    });
  }

  private getAchSetups(): void {
    this.achSetupService.getAchSetups(this.currentPage, this.pageSize).then(result => {
      this.achSetups = result;
      this.totalItems = this.achSetups[0].TotalCount;
    });
  }

}
