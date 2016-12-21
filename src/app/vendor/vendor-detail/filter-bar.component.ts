import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import {  CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';

import { VendorModel } from '../shared/vendor.model';

export class VendorFilterArguments {
  companyId: number = 0;
}

@Component({
  selector: 'sp-vendor-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class VendorDetailFilterComponent extends BaseComponent implements OnInit {

  @Input() vendorDetail: VendorModel;
  @Output() filtered: EventEmitter<VendorFilterArguments> = new EventEmitter<VendorFilterArguments>();
  @Input() filteredValue: VendorFilterArguments = new VendorFilterArguments();
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();

  private get companyFilteredArg(): CompanyFilterArguments {
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  }
  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private searchByCompany(): void {
    this.filteredValue.companyId = this._companyFilteredValue.companyId;
    this.filtered.emit(this.filteredValue);
  }

  private resetSearch(): void {
    this.filteredValue.companyId = 0;
    let companyArray = { companyId: 0 };
    this.companyFilteredArg = companyArray;
    this.filtered.emit(this.filteredValue);
  }
  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = filteredValue;
  }
}
