import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { BaseComponent } from '../base.component';
import { IniSetupModel } from './shared/ini-setup.model';

import { UserService } from '../user/shared/user.service';
import { AccountService } from '../account/shared/account.service';
import { IniSetupService } from './shared/ini-setup.service';
import { RoleService } from '../role/shared/role.service';
import { SetupModalComponent, SetupModalContext } from './setup-modal.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { RoleModel } from '../role/shared/role.model';

@Component({
  selector: 'sp-ini-setup',
  templateUrl: './ini-setup.component.html',
})

export class IniSetupComponent extends BaseComponent implements OnInit {
  private iniSetupModel: IniSetupModel;
  private userArray: Array<any> = [];
  private account: Object;
  private roles: Array<any> = [];

  private selectedProcessScannedRole: RoleModel= new RoleModel();
  private selectedReviewRole: RoleModel= new RoleModel();
  private selectedApproveRole: RoleModel= new RoleModel();
  private selectedBatchRole: RoleModel= new RoleModel();
  private selectedDeleteRole: RoleModel= new RoleModel();
  private selectedApproverOverrideRole: RoleModel= new RoleModel();
  private selectedSyncBatchestoSkylineRole: RoleModel= new RoleModel();

  constructor(
    vcRef: ViewContainerRef,
    overlay: Overlay,
    public modal: Modal,
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private iniSetupService: IniSetupService,
    private roleService: RoleService,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
    this.iniSetupModel = new IniSetupModel();
    this.getSessionDetails();
   // overlay.defaultViewContainer = vcRef;
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
      this.roles = result;
      let obj = { RoleID: 0, AccountID: 0, Name: 'All', Description: 'All' };
      this.roles.splice(0, 0, obj);
      let temp = this.roles;
      this.roles = [];
      temp.map((item: any) => {
        this.roles.push(
          { label: item.Name, value: item });
      });
      this.getIniSetupDetails();
    });
  }

  private getIniSetupDetails(): void {
    this.iniSetupService.getIniSetupDetails().then(result => {
      this.iniSetupModel = result;

      this.roles.map((item) => {
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.ProcessScannedRoleID) {
          // this.selectedProcessScannedRole[0].selected = item;
          this.selectedProcessScannedRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.ReviewInvoiceRoleID) {
          this.selectedReviewRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.ApproveInvoiceRoleID) {
          this.selectedApproveRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.BatchInvoiceRoleID) {
          this.selectedBatchRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.DeleteInvoiceRoleID) {
          this.selectedDeleteRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.ApproverOverrideRoleID) {
          this.selectedApproverOverrideRole = item.value;
        }
        if (item.value.RoleID === this.iniSetupModel.GlobalPermissions.SyncBatchestoSkylineRoleID) {
          this.selectedSyncBatchestoSkylineRole = item.value;
        }
      });
    });
  }

  private updateInvoiceRole(RoleID, verb): void {

  }

  private saveIniSetupDetails(): boolean {
    this.iniSetupModel.GlobalPermissions.ProcessScannedRoleID = this.selectedProcessScannedRole.RoleID;
    this.iniSetupModel.GlobalPermissions.ReviewInvoiceRoleID = this.selectedReviewRole.RoleID;
    this.iniSetupModel.GlobalPermissions.ApproveInvoiceRoleID = this.selectedApproveRole.RoleID;
    this.iniSetupModel.GlobalPermissions.BatchInvoiceRoleID = this.selectedBatchRole.RoleID;
    this.iniSetupModel.GlobalPermissions.DeleteInvoiceRoleID = this.selectedDeleteRole.RoleID;
    this.iniSetupModel.GlobalPermissions.ApproverOverrideRoleID = this.selectedApproverOverrideRole.RoleID;
    this.iniSetupModel.GlobalPermissions.SyncBatchestoSkylineRoleID = this.selectedSyncBatchestoSkylineRole.RoleID;
    if (this.iniSetupModel.filepathObject.path == null) {
      this.toastr.error('please select ini file to uplaod first', 'Oops!');
      // alert("please select ini file to uplaod first");
      // messageService.showMsgBox("Error", "please select ini file to uplaod first", "error");
      return false;
    }
     this.iniSetupService.saveIniSetupDetails(this.iniSetupModel).then((result) => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.getIniSetupDetails();
        // alert("Ini Setup successfully saved.");
        this.toastr.success('Ini Setup successfully saved.', 'Success!');
        // messageService.showMsgBox("Success", "Ini Setup successfully saved.", "success");
      }
    });
  }

  public getDirectories(filepath, category) {
    let Serverfiles: Array<any> = [];
    if (filepath === '') {
      filepath = null;
    }

    if (category === '14') {
      category = 14;
    }
    this.iniSetupModel.filepathObject.path = filepath;
    this.iniSetupModel.filepathObject.Category = category;
    if (category === 14 || category === 0 || category === 10) {
      this.getDirectoryDetail(this.iniSetupModel);
    }
  }
  public getDirectoryDetail(Serverfiles) {
    const builder = new BSModalContextBuilder<SetupModalContext>(
      { Serverfiles: Serverfiles } as any,
      undefined,
      SetupModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };
    // return this.modal.open(InvoiceEntryAccountsComponent, overlayConfig)
    //   .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
    //    .then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
    //    .then(result => {
    //     alert(result)
    //    this.addGlAccountByPopup(result);

    //    })

    // return this.modal.open(SetupModalComponent, overlayConfig)
    //   .catch (err => alert('ERROR'))
    //   .then(dialog => dialog.result)
    //   .then(result => {
    //     this.getIniSetupDetails();
    //   });

    const dialog = this.modal.open(SetupModalComponent, overlayConfig);
     dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
              this.getIniSetupDetails();
            }, () => console.log(' Error In init-setup form modal '));
        });
  }
}
