import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorModel } from '../shared/vendor.model';
import { VendorFilterArguments } from './filter-bar.component';

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
  private ledgerAccountId: number = null;

  private vendors: Array<VendorModel>;
  private _filteredValue: VendorFilterArguments = new VendorFilterArguments();

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
    this.getParameterValues();
  }

  ngOnInit() {
  }

  private get filteredValue(): VendorFilterArguments {
    return this._filteredValue;
  }
  private set filteredValue(newValue: VendorFilterArguments) {
    this._filteredValue = newValue;
    this.searchUrl();
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      let searchParameters = params['searchParameters'];
      if (searchParameters) {
        let parameterArray: Array<string> = searchParameters.split(',');
        this._filteredValue.companyId = parseInt(parameterArray[0]);
        this._filteredValue.vendorKey = parameterArray[1];
        this._filteredValue.vendorName = parameterArray[2];
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
      this.ledgerAccountId,
      this._filteredValue.companyId,
      this._filteredValue.vendorName,
      this._filteredValue.vendorKey,
      this.currentPage, this.pageSize)
      .then((result) => {
        if (result) {
          this.vendors = result;
          if (this.vendors && this.vendors.length > 0) {
            this.totalItems = this.vendors[0].VendorsCount;
          } else {
            this.totalItems = 0;
          }
        }
        // var instanseId = paginationService.getLastInstanceId();
        // paginationService.setCurrentPage(instanseId, $scope.currentPage);
      });
  }

  private searchUrl(): void {
    let link = ['/vendor', this._filteredValue.companyId + ',' + this._filteredValue.vendorKey + ',' + this._filteredValue.vendorName];
    this.router.navigate(link);
  }

  public onFiltered(filteredValue: VendorFilterArguments): void {
    this.filteredValue = filteredValue;
  }

}



