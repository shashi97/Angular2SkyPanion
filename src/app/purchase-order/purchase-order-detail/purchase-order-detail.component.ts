import { Component, OnInit , AfterViewInit} from '@angular/core';
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

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  providers: [PurchaseOrderSevice, AccountService]
})

export class PurchaseOrderDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
  
  private showLoader:boolean;
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
    public purchaseOrderService: PurchaseOrderSevice,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.purchaseOrderDetail = new PurchaseOrderModel();
  }



 ngOnInit(): void {
   
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }


  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      this.purchaseOrderId = +params['id'];

    });
    if (this.user) {
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
