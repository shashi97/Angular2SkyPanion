import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';

import { VendorModel } from '../shared/vendor.model';

export class VendorFilterArguments {
  companyId: number = 0;
  vendorName: string = '';
  vendorKey: string = '';
}

@Component({
  selector: 'sp-vendor-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class VendorFilterComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() vendorDetail: VendorModel;
  @Output() filtered: EventEmitter<VendorFilterArguments> = new EventEmitter<VendorFilterArguments>();
  @Input() filteredValue: VendorFilterArguments = new VendorFilterArguments();
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }


  ngOnInit() {
  }
  ngOnChanges() {
    this.companyFilteredArg = this.filteredValue;
  }

  private get companyFilteredArg(): CompanyFilterArguments {
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  }

  public onCurrentPageChanged(newValue: VendorFilterArguments) {
    this.filteredValue = newValue;
  }

  private searchUrl(): void {
    this.filteredValue.companyId = this._companyFilteredValue.companyId;
    this.filtered.emit(this.filteredValue);
  }

  private searchUrlReset(): void {
    this.filteredValue.companyId = 0;
    this.filteredValue.vendorKey = '';
    this.filteredValue.vendorName = '';
    let companyArray = { companyId: 0 };
    this.companyFilteredArg = companyArray;
    this.filtered.emit(this.filteredValue);
    
  }

  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = filteredValue;
  }
}
