
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { PurchaseOrderModel } from '../shared/purchase-order.model';

@Component({
  selector: 'sp-purchase-order-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class PurchaseOrderFilterComponent extends BaseComponent implements OnInit {

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}
