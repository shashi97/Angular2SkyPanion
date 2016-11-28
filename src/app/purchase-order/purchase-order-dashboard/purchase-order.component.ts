import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { PurchaseOrderModel } from '../shared/purchase-order.model';

import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-purchase-order',
  templateUrl: './purchase-order.component.html',
})

export class PurchaseOrderComponent extends BaseComponent implements OnInit {

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
  
}
