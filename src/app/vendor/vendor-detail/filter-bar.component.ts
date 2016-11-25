import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import { VendorModel } from '../shared/vendor.model';

export class VendorFilterArguments {
  companyId:number
}

@Component({
    selector: 'sp-vendor-filter-bar',
    templateUrl: './filter-bar.component.html',
})

export class VendorFilterComponent extends BaseComponent implements OnInit {

    @Input() vendorDetail: VendorModel;
    @Input() filtered: (filteredValue:VendorFilterArguments) => void;

    @Input() filteredValue: VendorFilterArguments = new VendorFilterArguments();   
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
        console.log(this.vendorDetail);
    }

    ngOnInit() {

    }

    private searchByCompany(): void {
      this.filteredValue.companyId = 1;
      this.filtered(this.filteredValue);
    }

    private resetSearch(): void {
        this.filteredValue.companyId = 0;
    }
}