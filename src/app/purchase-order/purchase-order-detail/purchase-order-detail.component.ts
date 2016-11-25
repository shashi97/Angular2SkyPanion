import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { PurchaseOrderModel } from '../shared/purchase-order.model';

@Component({
    selector: 'sp-purchase-order-detail',
    templateUrl: './purchase-order-detail.component.html',
})

export class PurchaseOrderDetailComponent extends BaseComponent implements OnInit {

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}