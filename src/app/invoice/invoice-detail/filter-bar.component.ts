import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';

@Component({
  selector: 'sp-invoice-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceDetailFilterComponent extends BaseComponent implements OnInit {

  @Input() invoiceDetail: InvoiceModel;
  
  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}