import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

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

export class VendorFilterComponent extends BaseComponent implements OnInit {

  @Input() vendorDetail: VendorModel;
  @Output() filtered: EventEmitter<VendorFilterArguments> = new EventEmitter<VendorFilterArguments>();
  @Input() filteredValue: VendorFilterArguments = new VendorFilterArguments();
  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
    console.log(this.vendorDetail);
  }

  ngOnInit() {
  }

  private searchUrl(): void {
    this.filteredValue.companyId = 1;
    this.filtered.emit(this.filteredValue);
  }

  private searchUrlReset(): void {
    this.filteredValue.companyId = 0;
    this.filteredValue.vendorKey = '';
    this.filteredValue.vendorName = '';
    this.filtered.emit(this.filteredValue);
  }
}