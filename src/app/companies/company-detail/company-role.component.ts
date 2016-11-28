import { Component, OnInit, Input } from '@angular/core';
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

export class CompanyRoleComponent extends BaseComponent implements OnInit {

  @Input() companyId: number;
  @Input() company: CompanyModel;
  private roleModel: RoleModel;
  private selectedCity: any;
  private options: Array<any> = [];
  private roles: Array<any> = [];
  private selectedViewInvoicesRole: RoleModel = new RoleModel();
  private selectedProcessRole: RoleModel = new RoleModel();
  private selectedReviewRole: RoleModel = new RoleModel();
  private selectedApproveRole: RoleModel = new RoleModel();
  private selectedBatchRole: RoleModel = new RoleModel();
  private selectedDeleteRole: RoleModel = new RoleModel();
  private selectedApproverRole: RoleModel = new RoleModel();
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

  ngOnInit() {
    this.getRoles();
  }
  private getRoles(): void {
    this.roleService.getRoles().then(result => {
      //  if (result.status === 404) {
      //  } else if (result.status === 500) {
      //  } else {
      //  this.roleModel.rolesDetail = result;
      this.roles = result;
      let defaultRole = { RoleID: 0, AccountID: 0, Name: 'None', Description: 'None' };
      this.roles.splice(0, 0, defaultRole);
      this.getCompanyDetails();
      //  }
    }).catch(function (params: any) {
      let message;
      message = params;

      if (message === undefined) {
        message = 'error';
      }
    });
  }

  private getCompanyDetails(): void {
    // this.companyService.getCompanyDetails(this.companyId).then(result => {
    //   this.company = result;
    this.roles.map((item) => {
      if (item.RoleID === this.company.view_invoice_role_id) {
        this.selectedViewInvoicesRole = item;
      }
      if (item.RoleID === this.company.create_invoice_role_id) {
        this.selectedProcessRole = item;
      }
      if (item.RoleID === this.company.review_invoice_role_id) {
        this.selectedReviewRole = item;
      }
      if (item.RoleID === this.company.approve_invoice_role_id) {
        this.selectedApproveRole = item;
      }
      if (item.RoleID === this.company.batch_invoice_role_id) {
        this.selectedBatchRole = item;
      }
      if (item.RoleID === this.company.delete_invoice_role_id) {
        this.selectedDeleteRole = item;
      }
      if (item.RoleID === this.company.approver_override_role_id) {
        this.selectedApproverRole = item;
      }
    });
    // this.getCompanyChartData('ap_totals');
    // }).catch(function (params: any) {
    //   let message;
    //   message = params;

    //   if (message === undefined) {
    //     message = 'error';
    //   }
    // });
  }

  public updateInvoiceRole(roleId: number, key: string): void {
    this.companyService.updateCompanyInvoiceRole(roleId, key, this.companyId).then((result) => {

    });

  }

}
