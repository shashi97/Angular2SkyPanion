import { Component, OnInit , ViewContainerRef } from '@angular/core';
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
import {
  confirmationModalContext,
  confirmationModalComponent
} from '../../shared/confirmation-modal/confirmation-modal.component';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';

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
   private header: string = "";
  private users: Array<UserModel> = [];

  private _filteredValue: UserFilterArguments = new UserFilterArguments();
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private sorting: any = {
    column: 'UserName', //to match the variable of one of the columns
    descending: false
  };
		
  constructor(
    private accountService: AccountService,
    localStorageService: LocalStorageService,
    router: Router,
     overlay: Overlay, public modal: Modal,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private confirmService: ConfirmService,
    public pubsub: PubSubService,
    public vcRef: ViewContainerRef
  ) {
    super(localStorageService, router);
    overlay.defaultViewContainer = vcRef;
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
        if (Number(result) > 0) {
          this.header = 'Are you Sure you' + 'd like to Disable Portal::Member:' + UserName + ' ?' + '\\n' +
            'WARNING:' + UserName + 's Approval is still needed on ' + result + ' invoices.';
          //  r = this.confirmService.confermMessage(message);
        } else {
          this.header = 'Are you Sure you' + 'd like to Disable Portal::Member:' + UserName + ' ?';
          // r = this.confirmService.confermMessage(message);
        }
         this.ChangeStateConfirmationModal(userID);
        // if (this.confirmService.confermMessage(message)) {
        //   this.disableUser(userID);
        // }

      });
    } else {
      this.header = 'Are you Sure you' + 'd like to enable Portal::Member:' + UserName + ' ?';
      this.ChangeStateConfirmationModal(userID);
      // if (this.confirmService.confermMessage(message)) {
      //   this.disableUser(userID);
      // }
    }
  }
     ChangeStateConfirmationModal(userID) {
    const builder = new BSModalContextBuilder<confirmationModalContext>(
      { header: this.header } as any,
      undefined,
      confirmationModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(confirmationModalComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result === "true") {
          this.disableUser(userID);
        }
      }, () => console.log(' user canceled logout modal '));
    });


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

}
