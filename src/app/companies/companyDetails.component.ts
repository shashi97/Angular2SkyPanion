import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { CompaniesService } from './shared/companies.service';
import { CompanyDetails } from './shared/companies.model';
import { RoleService } from '../role/shared/role.service';
import { ActivatedRoute } from '@angular/router';
import { RoleModel, RoleInfo } from '../role/shared/role.model';
import { UserService } from '../shared/services/user/user.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'sp-companies',
  templateUrl: './companyDetails.component.html',
  providers: [CompaniesService, RoleService, UserService]
})

export class CompanyDetailsComponent extends BaseComponent implements OnInit {

  private companyId: number;
  private searchParameters: number;
  private apTotals: boolean = false;
  private diskUsage: boolean = false;
  private syncInfo: boolean = false;
  private apTotalsNoData: boolean = false;
  private diskUsageNoData: boolean = false;
  private syncInfoNoData: boolean = false;;
  // need to conferm, selected variable will be bind for dropdown, 
  private companyChartDetail: any;
  private selectedViewInvoicesRole: RoleInfo = new RoleInfo();
  private selectedProcessRole: RoleInfo = new RoleInfo();
  private selectedReviewRole: RoleInfo = new RoleInfo();
  private selectedApproveRole: RoleInfo = new RoleInfo();
  private selectedBatchRole: RoleInfo = new RoleInfo();
  private selectedDeleteRole: RoleInfo = new RoleInfo();
  private selectedApproverRole: RoleInfo = new RoleInfo();


  private roleModel: RoleModel = new RoleModel();
  private companyDetails: CompanyDetails = new CompanyDetails();
  constructor(private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private roleService: RoleService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['companyId'];
      this.searchParameters = +params['SearchParameters'];
    });
    this.getSessionDetails();

  }

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getRoles();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  private getRoles(): void {
    this.roleService.getRoles().then(result => {
      //  if (result.status === 404) {
      //  } else if (result.status === 500) {
      //  } else {
      this.roleModel.rolesDetail = result;
      let defaultRole = { RoleID: 0, AccountID: 0, Name: 'None', Description: 'None' };
      this.roleModel.rolesDetail.splice(0, 0, defaultRole);
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

  public updateInvoiceRole(roleId: number, key: string): void {
    this.companiesService.updateCompanyInvoiceRole(roleId, key, this.companyId).then((result) => {

    });

  }

  private getCompanyDetails(): void {
    this.companiesService.getCompanyDetails(this.companyId).then(result => {
      this.companyDetails = result;
      this.roleModel.rolesDetail.map((item) => {
        if (item.RoleID === this.companyDetails.view_invoice_role_id) {
          this.selectedViewInvoicesRole = item;
        }
        if (item.RoleID === this.companyDetails.create_invoice_role_id) {
          this.selectedProcessRole = item;
        }
        if (item.RoleID === this.companyDetails.review_invoice_role_id) {
          this.selectedReviewRole = item;
        }
        if (item.RoleID === this.companyDetails.approve_invoice_role_id) {
          this.selectedApproveRole = item;
        }
        if (item.RoleID === this.companyDetails.batch_invoice_role_id) {
          this.selectedBatchRole = item;
        }
        if (item.RoleID === this.companyDetails.delete_invoice_role_id) {
          this.selectedDeleteRole = item;
        }
        if (item.RoleID === this.companyDetails.approver_override_role_id) {
          this.selectedApproverRole = item;
        }
      });
      this.getCompanyChartData('ap_totals');
    }).catch(function (params: any) {
      let message;
      message = params;

      if (message === undefined) {
        message = 'error';
      }
    });
  }

  private getCompanyChartData(status: string): void {
    this.setDefaultAptValue(status);
    this.companiesService.getCompanyChartData(status, this.companyId).then(result => {
      {
        this.apTotalsNoData = false;
        this.diskUsageNoData = false;
        this.syncInfoNoData = false;
        switch (status) {
          case 'ap_totals':
            this.apTotals = true;
            this.diskUsage = false;
            this.syncInfo = false;
            break;
          case 'disk_usage':
            this.apTotals = false;
            this.diskUsage = true;
            this.syncInfo = false;
            break;
          case 'disk_usage':
            this.apTotals = false;
            this.diskUsage = false;
            this.syncInfo = true;
            break;

          default:
            break;
        }
        this.companyChartDetail = result;
      }
    }).catch(function (params: any) {
      if (params.status === 404 || params.status === 500) {
        // this.apTotals = false;
        // this.diskUsage = false;
        // this.syncInfo = false;
        // if (status === 'ap_totals') {
        //   this.apTotalsNoData = true;
        //   this.diskUsageNoData = false;
        //   this.syncInfoNoData = false;
        //   this.companyChartDetail = '';
        // } else if (status === 'disk_usage') {
        //   this.apTotalsNoData = false;
        //   this.diskUsageNoData = true;
        //   this.syncInfoNoData = false;
        //   this.companyChartDetail = '';
        // } else if (status === 'sync_info') {
        //   this.apTotalsNoData = false;
        //   this.diskUsageNoData = false;
        //   this.syncInfoNoData = true;
        //   this.companyChartDetail = '';
        // }
      }
    });
  };
  private setDefaultAptValue(status: string) {

        this.apTotals = false;
        this.diskUsage = false;
        this.syncInfo = false;
        if (status === 'ap_totals') {
          this.apTotalsNoData = true;
          this.diskUsageNoData = false;
          this.syncInfoNoData = false;
          this.companyChartDetail = '';
        } else if (status === 'disk_usage') {
          this.apTotalsNoData = false;
          this.diskUsageNoData = true;
          this.syncInfoNoData = false;
          this.companyChartDetail = '';
        } else if (status === 'sync_info') {
          this.apTotalsNoData = false;
          this.diskUsageNoData = false;
          this.syncInfoNoData = true;
          this.companyChartDetail = '';
        }

  }
}

