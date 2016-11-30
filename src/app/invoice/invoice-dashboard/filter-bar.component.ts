import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';
import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';
import { VendorDropdownComponent, VendorFilterArguments } from '../../shared/dropdown/vendor/vendor-dropdown.component';
import { UserDropdownComponent } from '../../shared/dropdown/user/user-dropdown.component';

export class InvoiceFilteredArgs {
  invFromDate: string = '';
  invToDate: string = '';
  invoiceDesc: string = '';
  invoiceNumber: string = '';
  companyId: number = 0;
  vendorId: number = 0;
  userId: number = 0;
  statusId: number = 0;
}

@Component({
  selector: 'sp-invoice-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceFilterComponent extends BaseComponent implements OnInit {

  private statusName: string = 'Invoice Status';
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
  private _vendorFilteredValue: VendorFilterArguments = new VendorFilterArguments();
  @Input() invoiceFilteredValue: InvoiceFilteredArgs = new InvoiceFilteredArgs();
  @Output() filteredInvoice: EventEmitter<InvoiceFilteredArgs> = new EventEmitter<InvoiceFilteredArgs>();


  private status: Array<any> =
  [{ statusId: null, StatusName: "None" },
  { statusId: 0, statusName: "Static" },
  { statusId: 1, statusName: "Waiting for Review" },
  { statusId: 2, statusName: "Waiting for Approval" },
  { statusId: 3, statusName: "Waiting for Batch" },
  { statusId: 4, statusName: "Waiting for Sync" },
  { statusId: 6, statusName: "Synced" },
  { statusId: 5, statusName: "Rejected" },
  { statusId: 7, statusName: "Deleted" }
  ];

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

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

  private searchUrl(): void {
    this.invoiceFilteredValue.vendorId = this.vendorFilteredArg.vendorId
    this.invoiceFilteredValue.companyId = this.companyFilteredArg.companyId
    this.filteredInvoice.emit(this.invoiceFilteredValue);
  }

  private searchUrlReset(): void {
    this.invoiceFilteredValue = new InvoiceFilteredArgs();
    // let vendorArray = { vendorId: 0 };
    // let companyArray = { companyId: 0 };
    // this.vendorFilteredArg = vendorArray;
    // this.companyFilteredArg = companyArray;
    this.filteredInvoice.emit(this.invoiceFilteredValue);
  }

  private onSelectStatus(selectedStatus) {
    this.invoiceFilteredValue.statusId = selectedStatus;
  }

  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = filteredValue;
  }

  public onVendorFiltered(filteredValue: VendorFilterArguments): void {
    this.vendorFilteredArg = filteredValue;
  }

}
