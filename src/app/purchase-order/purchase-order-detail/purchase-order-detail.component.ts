import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AccountService } from '../../account/shared/account.service';
import { AccountModel } from '../../account/shared/account.model';
import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { SelectItem } from 'primeng/primeng';
import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { PurchaseOrderModel } from '../shared/purchase-order.model';


@Component({
  selector: 'sp-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  providers: [PurchaseOrderSevice, AccountService]
})

export class PurchaseOrderDetailComponent extends BaseComponent implements OnInit {

  private purchaseOrderId: number;
  private purchaseOrderDetail: PurchaseOrderModel;
  private currentPage: number = 1;
  private pageSize: number = 25;


  selectedCity: any;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public purchaseOrderService: PurchaseOrderSevice
  ) {
    super(localStorageService, router);
    this.purchaseOrderDetail = new PurchaseOrderModel();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.purchaseOrderId = +params['purchaseOrderId'];

    });
    this.getSessionDetails();
  }

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getPurchaseOrderById();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }

  }

  private getPurchaseOrderById(): void {
    this.purchaseOrderService.getPurchaseOrderById(this.purchaseOrderId, this.currentPage, this.pageSize).then((result) => {
      this.purchaseOrderDetail = result;
    });

  }
}
