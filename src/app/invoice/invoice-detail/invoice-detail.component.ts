import { Component, OnInit, Input, EventEmitter , AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ApiUrl } from '../../config.component';
import { InvoiceModel } from '../shared/invoice.model';
import { UserModel } from '../../user/shared/user.model';
import { CompanyModel } from '../../companies/shared/company.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from '../../companies/shared/company.service';

import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

import { UserService } from '../../user/shared/user.service';
import { InvoiceService } from '../shared/invoice.service';

import { OrderByPipe, CurrencyPipe } from '../../shared/pipe/orderby';
import { Location } from '@angular/common';

export class InvoiceArgs {
  invType: string = 'pdf';
  invoiceId: number = 0;
}


@Component({
  selector: 'sp-invoice-detail',
  templateUrl: './invoice-detail.component.html',
   providers: [CurrencyPipe]
})

export class InvoiceDetailComponent extends BaseComponent implements OnInit , AfterViewInit {

  @Input() invoiceArgsValue: InvoiceArgs;
  private showLoader:boolean;
  private userDetail: UserModel;
  private companyDetail: CompanyModel;
  private invoiceDetail: InvoiceModel;
  private invoiceId: number;
  private invoiceNumber: string = '';
  private vendorId: number = 0;
  private companyId: number = 0;
  private statusId: number = 0;
  private userId: number = 0;
  private searchString: string = '';
  private checkDetails: Array<any> = [];
  private invoiceArgs: InvoiceArgs = new InvoiceArgs();
  
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private companiesService: CompanyService,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public pubsub: PubSubService,
    private location: Location) {
    super(localStorageService, router);
    this.invoiceDetail = new InvoiceModel();
  }

 ngOnInit(): void { 
    

      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }


  ngAfterViewInit() {
    if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.invoiceId = +params['InvoiceID'];
      this.invoiceArgs.invoiceId = this.invoiceId;
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];
       this.searchString = pageSizeFilter + '/' + searchParameters;
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
    };

    this.invoiceService.getInvoiceId(invSearchObject).then(result => {
      if (result.status === 404) {
        this.getInvoiceDetail();
      } else {
        this.getInvoiceDetail();
      }

    });
  }

  private getInvoiceDetail() {

    this.location.replaceState('invoice/detail/' + this.searchString);
    let roleExistCount: number = 0;
    return new Promise((resolve, reject) => {
    this.invoiceService.getInvoiceDetail(this.invoiceId, 0).then(result => {
      this.invoiceDetail = result;
      if (this.invoiceDetail.InvoiceID === 0) {
        this.invoiceDetail.docType = 5;
      } else {
        this.invoiceDetail.docType = 10;
      }

      if (this.invoiceDetail.InvoiceStatusID == 0) {
        this.invoiceArgs.invType = 'duplicates';
      }

      this.companiesService.getCompanyDetail(this.invoiceDetail.CompanyID).then(response => {
        this.companyDetail = response;
        let link = ['/company'];
        if (this.user.IsSuperUser === false && this.companyDetail.view_invoice_role_id !== 0) {
          if (this.userDetail.selectedRoles.length > 0) {
            this.userDetail.selectedRoles.forEach(element => {
              if (this.companyDetail.view_invoice_role_id === element.RoleID) {
                roleExistCount = roleExistCount + 1;
              }
            });
          } else {
            this.router.navigate(link);
          }
          if (roleExistCount === 0) {
            this.router.navigate(link);
          }
        }

        let invSearchData = {invoiceID :this.invoiceDetail.InvoiceID, invoiceNumber: this.invoiceDetail.InvoiceNumber,
                              voucherLastKey:'', CompanyID: this.invoiceDetail.CompanyID };

        this.invoiceService.getInvoicesCheckDetailsByInvoiceNumber(invSearchData).then(res => {
          if (res.status === 404) {
          } else if (res.status === 500) {
          } else {
            this.checkDetails = res;
          }
        });
      });
    });
   });
  }
}
