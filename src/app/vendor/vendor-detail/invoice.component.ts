import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorModel } from '../shared/vendor.model';

@Component({
  selector: 'sp-vendor-detail-invoice',
  templateUrl: './invoice.component.html',
})

export class VendorDetailInvoiceComponent extends BaseComponent implements OnInit {
  @Input() vendorDetail: VendorModel;
  @Input() totalItems: number;

  private sorting: any = {
  column: 'InvoiceNumber', //to match the variable of one of the columns
  descending: false
  };
		

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  convertSorting() {
    return this.sorting.descending ? '-' + this.sorting.column : this.sorting.column;
  }

  selectedClass(columnName) {
    return columnName == this.sorting.column ? 'sort-' + this.sorting.descending : false;
  }

  changeSorting(columnName): void {
    var sort = this.sorting;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }

}
