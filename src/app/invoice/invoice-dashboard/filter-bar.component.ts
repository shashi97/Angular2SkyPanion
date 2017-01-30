import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';
import { VendorDropdownComponent, VendorFilterArguments } from '../../shared/dropdown/vendor/vendor-dropdown.component';
import { UserDropdownComponent } from '../../shared/dropdown/user/user-dropdown.component';
import { UserFilterArguments } from '../../shared/dropdown/user/user-dropdown.component';
import * as moment from 'moment';

declare let jQuery: any;

export class InvoiceFilteredArgs {
  invFromDate: string = '';
  invToDate : string = '';
  invoiceDesc: string = '';
  invoiceNumber: string = '';
  companyId: number = 0;
  vendorId: number = 0;
  statusId: number = -1;
  userId: number = -1;
  datefURL: Date = null;
  datetURL: Date= null;
}

@Component({
  selector: 'sp-invoice-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceFilterComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() invoiceFilteredValue: InvoiceFilteredArgs = new InvoiceFilteredArgs();
  @Output() filteredInvoice: EventEmitter<InvoiceFilteredArgs> = new EventEmitter<InvoiceFilteredArgs>();

  private statusName: string = 'Invoice Status';
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
  private _vendorFilteredValue: VendorFilterArguments = new VendorFilterArguments();
  private _userFilteredValue: UserFilterArguments = new UserFilterArguments();

  private status: Array<any> =
  [{ statusId: null, StatusName: 'None' },
  { statusId: 0, statusName: 'Static' },
  { statusId: 1, statusName: 'Waiting for Review' },
  { statusId: 2, statusName: 'Waiting for Approval' },
  { statusId: 3, statusName: 'Waiting for Batch' },
  { statusId: 4, statusName: 'Waiting for Sync' },
  { statusId: 6, statusName: 'Synced' },
  { statusId: 5, statusName: 'Rejected' },
  { statusId: 7, statusName: 'Deleted' }
  ];

  private get companyFilteredArg(): CompanyFilterArguments {
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  }

  private get vendorFilteredArg(): VendorFilterArguments {
    return this._vendorFilteredValue;
  }

  private set vendorFilteredArg(newValue: VendorFilterArguments) {
    this._vendorFilteredValue = newValue;
  }

  private get userFilteredArg(): UserFilterArguments {
    return this._userFilteredValue;
  }

  private set userFilteredArg(newValue: UserFilterArguments) {
    this._userFilteredValue = newValue;
  }

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    jQuery('#invoice_FromDate').datepicker().datepicker({ dateFormat: 'MM/DD/YYYY' });
    jQuery('#invToDate').datepicker().datepicker({ dateFormat: 'MM/DD/YYYY' });
  }
ngOnChanges() {
    this.companyFilteredArg.companyId = this.invoiceFilteredValue.companyId;
    this.userFilteredArg.UserID = this.invoiceFilteredValue.userId;
    this.vendorFilteredArg.vendorId = this.invoiceFilteredValue.vendorId;
    this.status.map((item) => {
      if (item.statusId === this.invoiceFilteredValue.statusId) {
        this.onStatusChange(item);
      }
    });
  }
  
  private searchUrl(): void {
    let dateFrom = jQuery('#invoice_FromDate').datepicker({ dateFormat: 'MM/DD/YYYY' });
    this.invoiceFilteredValue.invFromDate =  dateFrom.val();

    if(this.invoiceFilteredValue.invFromDate !==  undefined && this.invoiceFilteredValue.invFromDate !==  ''){
      this.invoiceFilteredValue.datefURL = moment(dateFrom.val(), 'MM/DD/YYYY').toDate();
    }

    let dateTo = jQuery('#invToDate').datepicker({ dateFormat: 'MM/DD/YYYY' });
    this.invoiceFilteredValue.invToDate = dateTo.val();

        if(this.invoiceFilteredValue.invToDate !==  undefined && this.invoiceFilteredValue.invToDate !==  ''){
       this.invoiceFilteredValue.datetURL = moment(dateTo.val(), 'MM/DD/YYYY').toDate();
    }

    this.invoiceFilteredValue.vendorId = this.vendorFilteredArg.vendorId;
    this.invoiceFilteredValue.companyId = this.companyFilteredArg.companyId;
    this.invoiceFilteredValue.userId = this.userFilteredArg.UserID;
    this.filteredInvoice.emit(this.invoiceFilteredValue);
  }

  private searchUrlReset(): void {
    this.invoiceFilteredValue = new InvoiceFilteredArgs();
    jQuery('#invoice_FromDate').val('');
    jQuery('#invToDate').val('');
    this.statusName = 'Invoice Status';
    this.vendorFilteredArg = new VendorFilterArguments();
    this.companyFilteredArg = new CompanyFilterArguments();
    this.userFilteredArg = new UserFilterArguments();
    this.filteredInvoice.emit(this.invoiceFilteredValue);
  }

  private onStatusChange(selectedStatus) {
    this.invoiceFilteredValue.statusId = selectedStatus.statusId;
    this.statusName = selectedStatus.statusName;
  }

  public onUserFiltered(filteredValue: UserFilterArguments): void {
    this.userFilteredArg = filteredValue;
  }

  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = filteredValue;
  }

  public onVendorFiltered(filteredValue: VendorFilterArguments): void {
    this.vendorFilteredArg = filteredValue;
  }
}
