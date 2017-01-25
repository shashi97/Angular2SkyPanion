import { Component, OnInit, Input ,OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { RoleModel } from '../../role/shared/role.model';
import { RoleService } from '../../role/shared/role.service';
import { CompanyService } from '../shared/company.service';
import { CompanyModel } from '../shared/company.model';


@Component({
  selector: 'sp-company-role',
  templateUrl: './company-role.component.html',
})

export class CompanyRoleComponent extends BaseComponent implements OnInit ,OnChanges {

  @Input() companyId: number;
  @Input() company: CompanyModel;
  private roleModel: RoleModel;
  private value: any = {};
  private roles: Array<any> = [];
  public selectedViewInvoicesRole: RoleModel;
  public selectedProcessRole: RoleModel;
  public selectedReviewRole: RoleModel;
  public selectedApproveRole: RoleModel;
  public selectedBatchRole: RoleModel;
  public selectedDeleteRole: RoleModel;
  public selectedApproverRole: RoleModel;
  public items: Array<any> = [{ text: 'Amsterdam' }, { text: 'Kolkata' }];
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private roleService: RoleService,
    private companyService: CompanyService
  ) {
    super(localStorageService, router);
    this.roles = new Array<any>();
    this.roleModel = new RoleModel();
  }

ngOnInit(){
   this.getRoles();
}

ngOnChanges(){
  this.getCompanyDetails();
}



  private getRoles(): void {
    this.roleService.getRoles().then(result => {
      this.roles = result;
      let defaultRole = { RoleID: 0, AccountID: 0, Name: 'None', Description: 'None' };
      this.roles.splice(0, 0, defaultRole);
      this.roles.map((role: any) => {
        role.text = role.Name;
      });

      let temp = this.roles;
      this.roles = [];
      temp.map((item: any) => {
        this.roles.push(
          { label: item.Name, value: item });
      });

    //  this.getCompanyDetails();
      //  }
    }).catch(function (params: any) {
      let message;
      message = params;

      if (message === undefined) {
        message = 'error';
      }
    });
  }

  public refreshValue(value: any): void {
    this.value = value;
  }



  private getCompanyDetails(): void {

    if(this.roles != []){
    this.roles.map((item) => {
      if (item.value.RoleID === this.company.view_invoice_role_id) {
        this.selectedViewInvoicesRole = item.value;
      }
      if (item.value.RoleID === this.company.create_invoice_role_id) {
        this.selectedProcessRole = item.value;
      }
      if (item.value.RoleID === this.company.review_invoice_role_id) {
        this.selectedReviewRole = item.value;
      }
      if (item.value.RoleID === this.company.approve_invoice_role_id) {
        this.selectedApproveRole = item.value;
      }
      if (item.value.RoleID === this.company.batch_invoice_role_id) {
        this.selectedBatchRole = item.value;
      }
      if (item.value.RoleID === this.company.delete_invoice_role_id) {
        this.selectedDeleteRole = item.value;
      }
      if (item.value.RoleID === this.company.approver_override_role_id) {
        this.selectedApproverRole = item.value;
      }
    });
  }
  }

  public updateInvoiceRole(selectedRole: RoleModel, key: string): void {
    this.companyService.updateCompanyInvoiceRole(selectedRole.RoleID, key, this.companyId).then((result) => {
    });
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }
}
