import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserModel } from '../shared/user.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { UserFilterArguments } from './filter-bar.component';

import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';

import { CurrentPageArguments } from '../../pagination/pagination.component';

@Component({
  selector: 'sp-user',
  templateUrl: './user.component.html',
})

export class UserComponent extends BaseComponent implements OnInit {

  private pageName: string = 'Users';
  private searchString: string = '';
  private account: Object;
  private totalItems: number = 0;
  private users: Array<UserModel> = [];

  private _filteredValue: UserFilterArguments = new UserFilterArguments();
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  constructor(
    private accountService: AccountService,
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {
    super(localStorageService, router);
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private get filteredValue(): UserFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: UserFilterArguments) {
    this._filteredValue = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.roleId + ','
      + this.filteredValue.userTypeId;
    this.getUsers();
  }

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getUsers();
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId != null && this.user.IsSuperUser === true) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let parameterValue: any = ((params) ? params : 1);
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');
        this.filteredValue.roleId = parseInt(parameterArray[0]);
        this.filteredValue.userTypeId = parameterArray[1];
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.filteredValue.roleId + ','
        + this.filteredValue.userTypeId;

      this.getAccountName();
    });
  }


  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      if (result.status === 404 || result.status === 500) {
      } else {
        this.account = result;
        this.getUsers();
      }
    });
  }

  private getUsers(): void {

    this.location.replaceState('users/' + this.searchString);

    this.userService.getUsers(
      this.filteredValue.userTypeId,
      this.filteredValue.roleId,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result.status === 404) {
          this.users = [];
          this.totalItems = 0;
        } else if (result.status === 500) {
        } else {
          this.users = [];
          this.users = result;
          if (this.users) {
            this.totalItems = this.users[0].UserCount;
          } else {
            this.totalItems = 0;
          }
        }

      });
  }

  public onFiltered(filteredValue: UserFilterArguments): void {
    this.filteredValue = filteredValue;
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

}
