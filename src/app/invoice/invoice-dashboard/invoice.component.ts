import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { InvoiceModel } from '../shared/invoice.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceFilteredArgs } from './filter-bar.component';
import { InvoiceService } from '../shared/invoice.service';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';
import { CurrentPageArguments } from '../../pagination/pagination.component';

@Component({
  selector: 'sp-invoice',
  templateUrl: './invoice.component.html',
})

export class InvoiceComponent extends BaseComponent implements OnInit {


  private account: Object;
  private totalItems: number = 0;
  private searchString: string = '';

  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _currentInvoiceArgs: InvoiceFilteredArgs = new InvoiceFilteredArgs();

  private Invoices: Array<InvoiceModel> = [];

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    super(localStorageService, router);
    this.Invoices = new Array<InvoiceModel>();
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }
  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getInvoices();
  }

  private get invoiceFilteredValue(): InvoiceFilteredArgs {
    return this._currentInvoiceArgs;
  }

  private set invoiceFilteredValue(newValue: InvoiceFilteredArgs) {
    this._currentInvoiceArgs = newValue;

    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.invoiceFilteredValue.invFromDate + ','
      + this.invoiceFilteredValue.invToDate + ','
      + this.invoiceFilteredValue.invoiceDesc + ','
      + this.invoiceFilteredValue.invoiceNumber + ','
      + this.invoiceFilteredValue.companyId + ','
      + this.invoiceFilteredValue.vendorId;

    this.getInvoices();
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId && this.user.IsSuperUser) {
      this.getParameterValues();
    } else {
      let link = ['/company'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let parameterValue: any = ((params) ? params : 1);
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');
        this.invoiceFilteredValue.invFromDate = parameterArray[0];
        this.invoiceFilteredValue.invToDate = parameterArray[1];
        this.invoiceFilteredValue.invoiceDesc = parameterArray[2];
        this.invoiceFilteredValue.invoiceNumber = parameterArray[3];
        this.invoiceFilteredValue.companyId = parseInt(parameterArray[4]);
        this.invoiceFilteredValue.vendorId = parseInt(parameterArray[5]);
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.invoiceFilteredValue.invFromDate + ','
        + this.invoiceFilteredValue.invToDate + ','
        + this.invoiceFilteredValue.invoiceDesc + ','
        + this.invoiceFilteredValue.invoiceNumber + ','
        + this.invoiceFilteredValue.companyId + ','
        + this.invoiceFilteredValue.vendorId;

      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getInvoices();
    });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  getInvoices() {

    this.location.replaceState('invoices/' + this.searchString);

    let searchFields = {
      invoiceNumber: this._currentInvoiceArgs.invoiceNumber,
      vendorId: this._currentInvoiceArgs.vendorId,
      companyId: this._currentInvoiceArgs.companyId,
      statusId: this._currentInvoiceArgs.statusId,
      userId: this._currentInvoiceArgs.userId,
      currentPage: this._currentPage.pageNo,
      pageSize: this._currentPage.pageSizeFilter,
      invFromDate: this._currentInvoiceArgs.invToDate,
      invToDate: this._currentInvoiceArgs.invToDate,
      invoiceDesc: this._currentInvoiceArgs.invoiceDesc,
    };

    this.invoiceService.getInvoices(searchFields).then(result => {
      this.Invoices = result;
      if (this.Invoices[0] && this.Invoices[0].InvoiceCount) {
        this.totalItems = this.Invoices[0].InvoiceCount;
      }
    });
  }

  public onFilteredInvoice(filteredValue: InvoiceFilteredArgs): void {
    this.invoiceFilteredValue = filteredValue;
  }

}
