import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { AccountService } from '../../account/shared/account.service';
import { RoleService } from '../shared/role.service';
import { RoleModel } from '../shared/role.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { PageHeaderTitleComponent } from '../../shared/others/page-header/page-header.component';

@Component({
  selector: 'sp-role-entry',
  templateUrl: './role-entry.component.html'

})
export class RoleEntryComponent extends BaseComponent implements OnInit {

  private searchParameters: number = -1;
  private currentPageFiltered: number = 25;
  private roleId: number = 0;
  private parameterValue: any;
  private pageHeader: string;
  private account: Object;
  private roleDetail: RoleModel;
  constructor(
    public localStorageService: LocalStorageService,
    public router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    public toastr: ToastsManager

  ) {
    super(localStorageService, router);
    this.currentPageFiltered = 25;
    this.roleDetail = new RoleModel();
  }

  ngOnInit() {
    if (this.user) {
      this.getMemberRoleDetail();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getMemberRoleDetail(): void {
    this.route.params.subscribe(params => {
      this.parameterValue = ((params) ? params : false);
      if (this.parameterValue) {
        this.searchParameters = Number(this.parameterValue.searchParameters);
        this.roleId = Number(this.parameterValue.id);
      }
      this.showRoles();

    });
  };

  private showRoles(): void {
    if (this.roleId === 0) {
      this.pageHeader = 'New Role';
      this.getAccountName();
    } else {
      this.pageHeader = 'Editing Role';
      this.getRolesByRoleId();
    }
  };

  private getRolesByRoleId(): void {
    this.roleService.getRolesByRoleId(this.roleId).then((result) => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.roleDetail = result;
      }
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.roleDetail.RoleID = 0;
      this.roleDetail.AccountID = result.AccountID;
      this.roleDetail.RoleName = '';
      this.roleDetail.Description = '';
      this.roleDetail.Picture = null;
      this.roleDetail.AccountName = result.AccountName;
    });
  }

  private saveRole(): boolean {
    if (this.roleDetail.RoleName === '' || this.roleDetail.RoleName == null) {
      this.toastr.error('Please enter role name', 'Oops!');
      return false;
    }

    this.roleService.saveRole(this.roleDetail).then((result) => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.toastr.success('Role saved successfully', 'Success!');
        let link = ['/role/view/' + result + '/' + this.currentPageFiltered + '/' + this.searchParameters];
        this.router.navigate(link);
      }
    });
  }
}
