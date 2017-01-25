import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { RoleService } from '../../role/shared/role.service';
import { PagingFilterArgumentsModel } from '../../shared/models/pagination-filter.model';
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
export class UserFilterArguments {
  userTypeId: string = '-1';
  roleId: number = -1;
}

@Component({
  selector: 'sp-user-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class UserFilterComponent extends BaseComponent implements OnInit, OnChanges {
  private showLoader:boolean;
  private userRoleName: string = 'User Role';
  private userTypeName: string = 'User Type';
  private userTypes: Array<any> = [];
  private roles: Array<any> = [];
  @Output() filtered: EventEmitter<UserFilterArguments> = new EventEmitter<UserFilterArguments>();
  @Input() filteredValue: UserFilterArguments = new UserFilterArguments();
   private paginationFilter: PagingFilterArgumentsModel;
  private searchString: string = '';
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private roleService: RoleService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.paginationFilter = new PagingFilterArgumentsModel();
    this.searchString = this.paginationFilter.pageSizeFilter + '/'
        + this.filteredValue.roleId + ','
        + this.filteredValue.userTypeId;
  }

  ngOnInit() {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);

  }
  ngOnChanges() {
    this.roles = [];
    this.userTypes = [];
    this.getRoles();
    this.getUserType();
    this.onSelectUserType(this.filteredValue.userTypeId);
  }

  private getRoles() {
    this.roleService.getRoles().then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.roles = result;
        let obj = { RoleID: 0, Name: 'All user roles', Description: 'All user roles' }
        this.roles.splice(0, 0, obj);

        this.roles.forEach(item => {
          if (item.RoleID === this.filteredValue.roleId) {
            this.userRoleName = item.Name;
          }
        });


      }
    });
  }

  private getUserType() {
    let item = [{ Id: 'All user types', Name: 'All user types' }, { Id: 'PortalMember', Name: 'Portal::Member' }];
    for (let i = 0; i < 2; i++) {
      this.userTypes.splice(i, 0, item[i]);
    }
  }

  private onSelectUserType(selectedUserId) {
    this.userTypes.forEach(item => {
      if (item.Id === selectedUserId) {
        this.filteredValue.userTypeId = selectedUserId;
        this.userTypeName = item.Name;
        if (this.filteredValue.userTypeId === 'Portal::Member') {
          this.filteredValue.userTypeId = 'PortalMember';
        }
      }
    });
  }

  private onSelectRole(selectedRoleId) {
    this.roles.forEach(item => {
      if (item.RoleID === selectedRoleId) {
        this.filteredValue.roleId = selectedRoleId;
        this.userRoleName = item.Name;
      }
    });
  }

  private searchUrl(): void {
    this.filtered.emit(this.filteredValue);
  }

  private searchUrlReset(): void {
    this.userRoleName = 'User Role';
    this.userTypeName = 'User Type';
    this.filteredValue = new UserFilterArguments();
    this.filtered.emit(this.filteredValue);
  }
}
