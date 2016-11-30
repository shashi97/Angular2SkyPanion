import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

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

  private Invoices: Array<InvoiceModel> = [];
  private account: Object;
  private totalItems: number = 0;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _currentInvoiceArgs: InvoiceFilteredArgs = new InvoiceFilteredArgs();

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
    this.getInvoices();
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId && this.user.IsSuperUser) {
      this.getAccountName();
    }
    else {
      let link = ['/company'];
      this.router.navigate(link);
    }
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
      // var instanseId = paginationService.getLastInstanceId();
      // paginationService.setCurrentPage(instanseId, this.currentPage);
    });
  }

  public onFilteredInvoice(filteredValue: InvoiceFilteredArgs): void {
    this.invoiceFilteredValue = filteredValue;
  }

}