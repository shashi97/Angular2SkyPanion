import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AccountService } from '../../account/shared/account.service';
import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { UserService } from '../../user/shared/user.service';

import { CurrentPageArguments } from '../../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PurchaseOrderModel } from '../shared/purchase-order.model';

@Component({
  selector: 'sp-purchase-order',
  templateUrl: './purchase-order.component.html',
  providers: [PurchaseOrderSevice, AccountService]
})

export class PurchaseOrderComponent extends BaseComponent implements OnInit {
  private account: Object;
  private purchaseOrders: Array<PurchaseOrderModel>;
  private purchaseOrder: PurchaseOrderModel;
  private totalItems: number;
  private pageName: string = 'Purchase Orders';
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private companyId: number = 0;
  private searchString: string = '';


  constructor(
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public purchaseOrderSevice: PurchaseOrderSevice,
    private route: ActivatedRoute,
    private location: Location,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
    this.purchaseOrders = new Array<PurchaseOrderModel>();
    this.purchaseOrder = new PurchaseOrderModel();
  }

  ngOnInit() {
    if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.companyId;
    this.getPurchaseOrders();
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.companyId = Number(parameterArray[0]);
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.companyId;

      this.getAccountName();

    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getPurchaseOrders();
    });
  }

  private getPurchaseOrders(): void {
    this.location.replaceState('purchaseOrder/' + this.searchString);
    this.purchaseOrderSevice
      .getPurchaseOrders(this.companyId, this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result.status === 404) {
          this.toastr.error('There is no data availablity', 'Oops!');
          // this.purchaseOrders = Array<PurchaseOrderModel>();
          // this.totalItems = 0;
        } else if (result.status === 500) {
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
