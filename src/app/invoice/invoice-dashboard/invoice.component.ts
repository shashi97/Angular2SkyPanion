import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { InvoiceService } from '../shared/invoice.service';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';

@Component({
  selector: 'sp-invoice',
  templateUrl: './invoice.component.html',
})

export class InvoiceComponent extends BaseComponent implements OnInit {

  private Invoices: Array<InvoiceModel> = [];
  private account: Object;
  private totalItems: number = 0;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private userService: UserService
  ) {
    super(localStorageService, router);
    this.Invoices = new Array<InvoiceModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  getSessionDetails() {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId != null && this.user.IsSuperUser == true) {
      // this.deleteDisbale = false;
      this.getAccountName();
    }
    else {
      let link = ['/company'];
      this.router.navigate(link);
    }
  }

  getAccountName() {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getInvoices();
    });
  }

  getInvoices() {

    // this.vendors.forEach(function (item) {
    //   if (item.id == this.vendorID) {
    //     this.selectedVendor.selected = item;
    //   }
    // });

    // this.companies.forEach(function (item) {
    //   if (item.CompanyID == this.companyID) {
    //     this.selectedCompany.selected = item;
    //   }
    // });


    // this.users.forEach(function (item) {
    //   if (item.UserID == this.userID) {
    //     this.userName = item.username;
    //     this.imagePath = item.ImagePath;
    //   }
    // });

    // this.status.forEach(function (item) {
    //   if (item.StatusID == this.statusID) {
    //     this.statusName = item.StatusName;
    //   }
    // });

    // if (this.invFromDate != null && this.invFromDate != "null" && this.invFromDate != "") {
    //   this.invFromDate = $moment(this.invFromDate).format($rootScope.momentDateFormat);
    // } else {
    //   this.invFromDate = '';
    // }

    // if (this.invToDate != null && this.invToDate != "null" && this.invToDate != "") {
    //   this.invToDate = $moment(this.invToDate).format($rootScope.momentDateFormat);
    // } else {
    //   this.invToDate = '';
    // }

    // if (this.invoiceNumber == null || this.invoiceNumber == "null" || this.invoiceNumber == undefined) {
    //   this.invoiceNumber = "";
    // }

    // if (this.invoiceDesc == null || this.invoiceDesc == "null" || this.invoiceDesc == undefined) {
    //   this.invoiceDesc = "";
    // }


    // this.searchFields = {
    //   invoiceNumber: this.invoiceNumber,
    //   vendorID: this.vendorID,
    //   companyID: this.companyID,
    //   statusID: this.statusID,
    //   userID: this.userID,
    //   currentPage: this.currentPage,
    //   pageSize: this.pageSize,
    //   invFromDate: this.invFromDate,
    //   invToDate: this.invToDate,
    //   invoiceDesc: this.invoiceDesc,
    // };

    let searchFields: any;
    this.invoiceService.getInvoices(searchFields).then(result => {
      this.Invoices = result;
      if (this.Invoices[0] && this.Invoices[0].InvoiceCount) {
        this.totalItems = this.Invoices[0].InvoiceCount;
      }

      // var instanseId = paginationService.getLastInstanceId();
      // paginationService.setCurrentPage(instanseId, this.currentPage);
    });
  }
}