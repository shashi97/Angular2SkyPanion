import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { AccountService } from '../../account/shared/account.service';
import { RoleService } from '../shared/role.service';
import { RoleModel } from '../shared/role.model';
import { RoleFilterArgument } from './filter-bar.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-role-dashboard',
  templateUrl: './role.component.html'

})
export class RoleComponent extends BaseComponent implements OnInit {

  private showLoader:boolean;
  private account: Object;
  private totalItems: number;
  private roles: Array<RoleModel>;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private pageName: string = 'All Roles';
  private searchString: string = '';
  private _filterRow: RoleFilterArgument = new RoleFilterArgument();
  constructor(
    public localStorageService: LocalStorageService,
    public router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    public toastr: ToastsManager,
    public location: Location,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.roles = new Array<RoleModel>();
    this.getSessionDetails();
  }
  ngOnInit(): void {
    this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
   }
  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }
  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    if (this.rolefilteredValue.roleName === '') {
      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + '-1';
    } else {
      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.rolefilteredValue.roleName;
    }

    this.getRoles();
  }
  private get rolefilteredValue(): RoleFilterArgument {
    return this._filterRow;
  }

  private set rolefilteredValue(newValue: RoleFilterArgument) {
    this._filterRow = newValue;

    if (this.rolefilteredValue.roleName === '') {
      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + '-1';
    } else {
      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.rolefilteredValue.roleName;
    }

    this.getRoles();
  }

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.rolefilteredValue.roleName = parameterArray[0];

        this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
          + this.rolefilteredValue.roleName;
      } else {
        this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
          + '-1';
      }

      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getRoles();
    });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }


  private getRoles(): void {

    this.location.replaceState('role/' + this.searchString);

    this.roleService.getRoleList(
      this.rolefilteredValue.roleName,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter
    ).then((result) => {
      if (result.status === 404) {
        this.roles = [];
        this.totalItems = 0;
      } else if (result.status === 500) {
      } else {
        this.roles = result;

        if (this.roles.length > 0) {
          this.totalItems = this.roles[0].RoleCount;
        } else {
          this.totalItems = 0;
        }
      }
    });
  }


  private deleteRole(roleId, roleName): void {

    let message = 'Are you sure you' + 'd like to delete';
    if (this.confirmService.confermMessage(message, roleName)) {
      this.roleService.deleteRole(roleId).then((result) => {
        if (result.status === 404 || result.status === 500) {
          this.toastr.error(result._body, 'Oops!');
          // messageService.showMsgBox("Error", result.data.ExceptionMessage, "error");
        } else {
          if (result._body === 'success') {
            this.toastr.success('Role successfully deleted.', 'Success!');
          } else {
            this.toastr.error(result._body, 'Oops!');
          }

          this.getRoles();
        }
      });

    }

  }

  public onRoleFiltered(filteredValue: RoleFilterArgument): void {
    this.rolefilteredValue = filteredValue;
  }

}
