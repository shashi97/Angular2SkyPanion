import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';
import { UserModel } from '../../user/shared/user.model';
import { CompanyModel } from '../../companies/shared/company.model';

import { CompanyService } from '../../companies/shared/company.service';

import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import { UserService } from '../../user/shared/user.service';
import { InvoiceService } from '../shared/invoice.service';

export class InvoiceArgs {
  invType: string = 'pdf';
  invoiceId: number = 0;
}


@Component({
  selector: 'sp-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})

export class InvoiceDetailComponent extends BaseComponent implements OnInit {

  @Input() invoiceArgsValue: InvoiceArgs;
  private userDetail: UserModel;
  private companyDetail: CompanyModel;
  private invoiceDetail: InvoiceModel;
  private invoiceId: number;
  private invoiceNumber: string = '';
  private vendorId: number = 0;
  private companyId: number = 0;
  private statusId: number = 0;
  private userId: number = 0;
  private checkDetails: Array<any> = [];
  private invoiceArgs: InvoiceArgs = new InvoiceArgs();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private companiesService: CompanyService,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute) {
    super(localStorageService, router);
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId) {
      this.getParameterValues();
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.invoiceId = params['invoiceId'];
      this.invoiceArgs.invoiceId = this.invoiceId;
      this.getUserDetails();
    });
  }

  private getUserDetails(): void {
    this.userService.getUserById(this.user.userId).then(result => {
      this.userDetail = result;
      this.getInvoiceId();
    });
  }

  private getInvoiceId(): void {

    let invSearchObject: Object = {
      invoiceId: this.invoiceId,
      invoiceNumber: this.invoiceNumber,
      vendorId: this.vendorId,
      companyId: this.companyId,
      statusId: this.statusId,
      userId: this.userId
    }

    this.invoiceService.getInvoiceId(invSearchObject).then(result => {
      if (result.status == 404) {
        this.getInvoiceDetail();
      } else {
        this.getInvoiceDetail();
      }

    });
  }

  private getInvoiceDetail(): void {
    let roleExistCount: number = 0;
    this.invoiceService.getInvoiceDetail(this.invoiceId, 0, false).then(result => {

      this.invoiceDetail = result;

      if (this.invoiceDetail.InvoiceID == 0) {
        this.invoiceDetail.docType = 5;
      } else {
        this.invoiceDetail.docType = 10;
      }

      // this.pdfsrc1 = apiServiceBase + 'api/invoices/getPdf/' + this.invoiceDetail.CompanyNumber + '/' + this.invoiceDetail.AttachmentName;
      // this.pdfsrc = $sce.trustAsResourceUrl(this.pdfsrc1);

      if (this.invoiceDetail.InvoiceStatusID == 0) {
        this.invoiceArgs.invType = 'duplicates';
      }

      this.companiesService.getCompanyDetail(this.invoiceDetail.CompanyID).then(result => {

        this.companyDetail = result;

        let link = ['/company'];
        if (this.user.IsSuperUser == false && this.companyDetail.view_invoice_role_id != 0) {
          if (this.userDetail.selectedRoles.length > 0) {
            this.userDetail.selectedRoles.forEach(element => {
              if (this.companyDetail.view_invoice_role_id == element.RoleID) {
                roleExistCount = roleExistCount + 1;
              }
            });
          } else {
            this.router.navigate(link);
          }
          if (roleExistCount == 0) {
            this.router.navigate(link);
          }
        }

        let invSearchData = { invoiceNumber: this.invoiceDetail.InvoiceNumber, CompanyId: this.invoiceDetail.CompanyID };

        this.invoiceService.getInvoicesCheckDetailsByInvoiceNumber(invSearchData).then(result => {
          if (result.status == 404) {
          } else if (result.status == 500) {
          } else {
            this.checkDetails = result;
          }
        });
      });
    });
  }
}
