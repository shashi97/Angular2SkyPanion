import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorModel } from '../shared/vendor.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import { VendorService } from '../shared/vendor.service';
import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';


@Component({
  selector: 'sp-vendorDetail',
  templateUrl: './vendor.component.html',
})

export class VendorComponent extends BaseComponent implements OnInit {

  private account: Object;

  /* Temporary variables */
  private currentPage: number = 1;
  private pageSize: number = 25;
  private totalItems: number = 0;
  private pageName: string = 'venders';

  private vendors: Array<VendorModel>;
  private vendor: VendorModel;

  constructor(
    private vendorSevice: VendorService,
    private accountService: AccountService,
    private masterService: MasterService,
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.vendors = new Array<VendorModel>();
    this.vendor = new VendorModel();
    this.getParameterValues();
  }

  ngOnInit() {
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      let searchParameters = params['searchParameters'];
      if (searchParameters) {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.vendor.CompanyID = parseInt(parameterArray[0]);
        this.vendor.VendorKey = parameterArray[1];
        this.vendor.VendorName = parameterArray[2];
      }
      this.getItemsPerPageList();
    });
  }

  getItemsPerPageList(): void {
    // this.itemsPerPageList = this.masterService.getItemsPerPageList();
    this.getAccountName();
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getVendors();
    });
  }

  private getVendors() {

    // this.ledgerAccountID = 0;
    // if ($scope.pageSizeFilter != null) {
    //   $scope.pageSize = $scope.pageSizeFilter;
    // }
    // this.companies.forEach((item) => {
    //   if (item.CompanyID == this.companyId) {
    //     // $scope.selectedCompany.selected = item;
    //   }
    // });

    this.vendorSevice
      .getVendors(
      this.vendor.LedgerAccountId,
      this.vendor.CompanyID,
      this.vendor.VendorName,
      this.vendor.VendorKey,
      this.currentPage, this.pageSize)
      .then((result) => {
        if (result) {
          this.vendors = result;
          if (this.vendors && this.vendors.length > 0) {
            this.totalItems = this.vendors[0].VendorsCount;
          }else {
            this.totalItems = 0;
          }
        }
        // var instanseId = paginationService.getLastInstanceId();
        // paginationService.setCurrentPage(instanseId, $scope.currentPage);
      });
  }

  private searchURL(): void {
    let link = ['/vendor', this.vendor.CompanyID + ',' + this.vendor.VendorKey + ',' + this.vendor.VendorName];
    this.router.navigate(link);
  }

  private searchURLReset(): void {
    this.currentPage = 1;
    this.pageSize = 25;
    this.vendor.VendorName = '';
    this.vendor.VendorKey = '';
    this.vendor.CompanyID = 0;
    this.searchURL();
  }

}



