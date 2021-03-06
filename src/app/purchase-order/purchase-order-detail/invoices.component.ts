import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { PurchaseOrderModel } from '../shared/purchase-order.model';


@Component({
  selector: 'sp-po-invoices',
  templateUrl: './invoices.component.html',
})


export class PurchaseOrderInvoicesComponent extends BaseComponent implements OnInit {

  @Input() purchaseOrderDetail: PurchaseOrderModel;
  private totalItems: number = 0;

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

}
