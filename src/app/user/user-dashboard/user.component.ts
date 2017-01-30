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
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-user',
  templateUrl: './user.component.html',
})

export class UserComponent extends BaseComponent implements OnInit {
  private showLoader:boolean;
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
    private location: Location,
    private confirmService: ConfirmService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
    if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
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
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.roleId + ','
      + this.filteredValue.userTypeId;
    this.getUsers();
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let parameterValue: any = ((params) ? params : 1);
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');
        this.filteredValue.roleId = Number(parameterArray[0]);
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

  private getUsers() {

    this.location.replaceState('user/' + this.searchString);
    return new Promise((resolve, reject) => {
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
      });
  }

  public onFiltered(filteredValue: UserFilterArguments): void {
    this.filteredValue = filteredValue;
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  public checkUserExistInInvoiceApproval(userID, UserName, DisableLink): void {
    if (DisableLink === 'Disable') {
      this.userService.checkUserExistInInvoiceApproval(userID).then((result) => {
        let message;
        if (Number(result) > 0) {
          message = 'Are you Sure you' + 'd like to Disable Portal::Member:' + UserName + ' ?' + '\\n' +
            'WARNING:' + UserName + 's Approval is still needed on ' + result.data + ' invoices.';
          //  r = this.confirmService.confermMessage(message);
        } else {
          message = 'Are you Sure you' + 'd like to Disable Portal::Member:' + UserName + ' ?';
          // r = this.confirmService.confermMessage(message);
        }
        if (this.confirmService.confermMessage(message)) {
          this.disableUser(userID);
        }

      });
    } else {
      let message = 'Are you Sure you' + 'd like to enable Portal::Member:' + UserName + ' ?';
      if (this.confirmService.confermMessage(message)) {
        this.disableUser(userID);
      }
    }
  }

  public disableUser(userID): void {
    this.userService.disableUser(userID).then((result) => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.getUsers();
      }
    });

  }

}
