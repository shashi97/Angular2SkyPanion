import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { PurchaseOrderSevice } from '../shared/purchase-order.service';
import { AccountService } from '../../account/shared/account.service';
import { CompanyService } from '../../companies/shared/company.service';
import { UserService } from '../../user/shared/user.service';

import { AccountModel } from '../../account/shared/account.model';
import { PurchaseOrderModel } from '../shared/purchase-order.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

@Component({
  selector: 'sp-purchase-order',
  templateUrl: './purchase-order.component.html',
})

export class PurchaseOrderComponent extends BaseComponent implements OnInit {

  private accountDetail: AccountModel
  private companyId: number = 0;


  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private purchaseOrderSevice: PurchaseOrderSevice,
    private accountService: AccountService,
    private companyService: CompanyService,
    private userService: UserService
  ) {
    super(localStorageService, router);
    this.getSessionDetails();
  }

  ngOnInit() {
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId && this.user.IsSuperUser) {
      if (this.companyId == 0) {
        this.getAccountName();
      } else {
        this.getCompanyName();
      }
    } else {
      let link = ['/dashboard']
      this.router.navigate(link);
    }
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.accountDetail = result.data;
        this.getPurchaseOrders();
      }
    });
  }

  private getCompanyName(): void {
    this.companyService.getCompanyName(this.companyId).then(result => {
      if (result.status == 404) {
        // $scope.gridData = [];
        // $scope.totalItems = 0;
        // $scope.companyName = '';
      } else if (result.status == 500) {
      } else {
        this.getPurchaseOrders();
        // $scope.companyName = result.data.replace(/"/g, '');
      }
    });
  }

  private getPurchaseOrders(): void {
    // if ($scope.pageSizeFilter) {
    //   $scope.pageSize = $scope.pageSizeFilter;
    // }

    // this.purchaseOrderSevice.getPurchaseOrders($scope.companyID, $scope.currentPage, $scope.pageSize)
    //   .then(result => {
    //     if (result.status == 404) {
    //       $scope.gridData = [];
    //       $scope.totalItems = 0;
    //     } else if (result.status == 500) {
    //     } else {
    //       $scope.gridData = result;
    //       $scope.totalItems = $scope.gridData[0].TotalCount;
    //       //$scope.getAccountName();
    //     }
    //   });
  }

}

