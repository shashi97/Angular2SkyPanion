import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorService } from '../../../vendor/shared/vendor.service';


@Component({
  selector: 'sp-vendor-dropdown',
  templateUrl: './vendor-dropdown.component.html',
})

export class VendorDropdownComponent extends BaseComponent implements OnInit {
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

  getSkypanionsVendors() {
    this.vendorService.getDistinctVendors().then(result => {
      this.vendors = result;
    });
  }
}