import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';
import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { PurchaseOrderModel } from '../shared/purchase-order.model';
import { UserService } from '../../user/shared/user.service';
import {CurrentPageArguments} from '../../pagination/pagination.component';

import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-purchase-order',
  templateUrl: './purchase-order.component.html',
  providers: [PurchaseOrderSevice, AccountService]
})

export class PurchaseOrderComponent extends BaseComponent implements OnInit {
  private account: Object;
  private purchaseOrders: Array<any>;
  private purchaseOrder: PurchaseOrderModel;
  private totalItems: number;
  private pageName: string = 'Purchase Orders';
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    columns: [
      new TableColumn({ name: 'Number', prop: 'VendorName' }),
      new TableColumn({ name: 'Description', prop: 'InvoiceDescription' }),
      new TableColumn({ name: 'Requested By', prop: 'RequestedBy' }),
      new TableColumn({ name: '', prop: 'Details' })
    ]
  });

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public purchaseOrderSevice: PurchaseOrderSevice,
    public masterService: MasterService
  ) {
    super(localStorageService, router);
    this.purchaseOrders = new Array<any>();
    this.purchaseOrder = new PurchaseOrderModel();
    this.getItemsPerPageList();
  }
  ngOnInit(): void { }

  public pageChanged(event: any): void {
    // this method will trigger every page click  
    console.log('Number items per page: ' + event.itemsPerPage);
  };

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getPurchaseOrders();
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  private getItemsPerPageList() {
    this.getSessionDetails();
  }

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getAccountName();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getPurchaseOrders();
    });
  }

  private getPurchaseOrders(): void {
    this.purchaseOrderSevice
      .getPurchaseOrders(this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result.status == 404) {
          this.purchaseOrders = [];
          this.totalItems = 0;
        } else if (result.status == 500) {
        } else {
          this.purchaseOrders = result;
          if (this.purchaseOrders && this.purchaseOrders.length > 0) {
            this.totalItems = this.purchaseOrders[0].TotalCount;
          } else {
            this.totalItems = 0;
          }
        }
      });
  }
}
