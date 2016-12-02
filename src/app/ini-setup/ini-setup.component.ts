import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { IniSetupModel } from './shared/ini-setup.model';

import { UserService } from '../user/shared/user.service';
import { AccountService } from '../account/shared/account.service';
import { IniSetupService } from './shared/ini-setup.service';
import { RoleService } from '../role/shared/role.service';


@Component({
  selector: 'sp-ini-setup',
  templateUrl: './ini-setup.component.html',
})

export class IniSetupComponent extends BaseComponent implements OnInit {
  private iniSetupModel: IniSetupModel;
  private userArray: Array<any> = [];
  private account: Object;
  private roleArray: Array<any> = [];

  private selectedProcessScannedRole: Array<any> = [];
  private selectedReviewRole: Array<any> = [];
  private selectedApproveRole: Array<any> = [];
  private selectedBatchRole: Array<any> = [];
  private selectedDeleteRole: Array<any> = [];
  private selectedApproverOverrideRole: Array<any> = [];
  private selectedSyncBatchestoSkylineRole: Array<any> = [];

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private iniSetupService: IniSetupService,
    private roleService: RoleService
  ) {
    super(localStorageService, router);
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId && this.user.IsSuperUser) {
      this.getUserDDOs();
    } else {
      window.location.href = '/#/dashboard';
    }
  }

  private getUserDDOs(): void {
    this.userService.getUserDDOs().then(result => {
      this.userArray = result;
      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getRoles();
    });
  }

  private getRoles(): void {
    this.roleService.getRoles().then(result => {
      this.roleArray = result;
      // var obj = { RoleID: 0, AccountID: 0, Name: 'All', Description: 'All' }
      // this.roles.splice(0, 0, obj);
      this.getIniSetupDetails();
    });
  }

  private getIniSetupDetails(): void {
    this.iniSetupService.getIniSetupDetails().then(result => {

      this.iniSetupModel = result;

      this.roleArray.forEach((item) => {
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.ProcessScannedRoleID) {
         // this.selectedProcessScannedRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.ReviewInvoiceRoleID) {
       //   this.selectedReviewRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.ApproveInvoiceRoleID) {
        ///  this.selectedApproveRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.BatchInvoiceRoleID) {
        //  this.selectedBatchRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.DeleteInvoiceRoleID) {
         // this.selectedDeleteRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.ApproverOverrideRoleID) {
        //  this.selectedApproverOverrideRole[0].selected = item;
        }
        if (item.RoleID === this.iniSetupModel.GlobalPermissions.SyncBatchestoSkylineRoleID) {
         // this.selectedSyncBatchestoSkylineRole[0].selected = item;
        }
      });
    });
  }
}
