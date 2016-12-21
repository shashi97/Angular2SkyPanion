import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorService } from '../../../vendor/shared/vendor.service';

export class VendorFilterArguments {
  vendorId: number = 0;
}

@Component({
  selector: 'sp-vendor-dropdown',
  templateUrl: './vendor-dropdown.component.html',
})

export class VendorDropdownComponent extends BaseComponent implements OnInit, OnChanges {

  @Output() public vendorFiltered: EventEmitter<VendorFilterArguments> = new EventEmitter<VendorFilterArguments>();
  @Input() vendorFilteredArg: VendorFilterArguments = new VendorFilterArguments();
  private selectedVendorArray: any;

  private vendors: Array<any> = [];
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private vendorService: VendorService
  ) {
    super(localStorageService, router);
    this.getSkypanionsVendors();
  }

  ngOnInit() {
  }

  ngOnChanges() {
      this.getSkypanionsVendors().then(res => {
      this.vendors.map((item) => {
         if (item.value.id === this.vendorFilteredArg.vendorId) {
          this.selectedVendorArray = item.value;
        }
      });
    });
  }

  private getSkypanionsVendors() {
    return this.vendorService.getDistinctVendors().then(result => {
      this.vendors = result;

      let defaultRole = {
        VendorKey: '', VendorName: 'All Vendors', id:0
      };
      this.vendors.splice(0, 0, defaultRole);

      let temp = this.vendors;
      this.vendors = [];

      temp.map((item: any) => {
        this.vendors.push(
          { label: item.VendorName, value: item });
      });
    });
  }

  private selectedVendor(selectedVendor): void {
    this.vendorFilteredArg.vendorId = selectedVendor.id;
    this.vendorFiltered.emit(this.vendorFilteredArg);
  }
}