import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';
import { VendorDropdownComponent } from '../../shared/dropdown/vendor/vendor-dropdown.component';
import { UserDropdownComponent } from '../../shared/dropdown/user/user-dropdown.component';

@Component({
  selector: 'sp-invoice-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceFilterComponent extends BaseComponent implements OnInit {

  private statusName: string = 'Invoice Status';  
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

}