import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user/shared/user.service';
import { AccountService } from '../../account/shared/account.service';
import { CompanyService } from '../../companies/shared/company.service';
import { AchSetupService } from '../shared/ach-setup.service';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';

import { AchSetupModel } from '../shared/ach-setup.model';

@Component({
  selector: 'sp-ach-setup',
  templateUrl: './ach-setup.component.html',
})

export class AchSetupComponent extends BaseComponent implements OnInit {

  private account: Object;
  private companyId: number = 0;
  private totalItems: number = 0;
  private achSetups: Array<AchSetupModel>;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private companiesService: CompanyService,
    private achSetupService: AchSetupService,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.achSetups = new Array<AchSetupModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getAchSetups();
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();

    if (this.user.userId != null && this.user.IsSuperUser === true) {
      this.getParameterValues();
    } else {
      let link = ['/company'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let pageSizeFilter = params['pageSizeFilter'];

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      if (this.companyId === 0) {
        this.getAccountName();
      } else {
        this.getCompanyName();
      }
    });
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
    this.achSetupService.getAchSetups(this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter).then(result => {
      this.achSetups = result;
      this.totalItems = this.achSetups[0].TotalCount;
    });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments): void {
    this.currentPageFiltered = newValue;
  }
}
