import { Component } from '@angular/core';
import { PurchaseOrderSevice } from './shared/purchaseOrder.service';
import { PurchaseOrderModel, purchaseOrderInfo } from './shared/purchaseOrder.model';

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
    selector: 'sp-purchaseOrder',
    templateUrl: './purchaseOrder.component.html',
    providers: [PurchaseOrderSevice]
})
export class PurchaseOrderComponent {
  options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ prop: 'Vendors' }),
            new TableColumn({ name: 'Description', prop: 'ActivationLink' }),
            new TableColumn({ name: 'Requested By' })
        ]
    });

}
