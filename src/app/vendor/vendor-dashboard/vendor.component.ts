import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { VendorModel } from '../shared/vendor.model';
import { VendorFilterArguments } from './filter-bar.component';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import { VendorService } from '../shared/vendor.service';
import { MasterService } from '../../shared/services/master/master.service';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';

import { CurrentPageArguments } from '../../pagination/pagination.component';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-vendorDetail',
  templateUrl: './vendor.component.html',
})

export class VendorComponent extends BaseComponent implements OnInit , AfterViewInit {

  private account: Object;
  /* Temporary variables */
  private searchString: string = '';
  private showLoader:boolean;
  private totalItems: number = 0;
  private pageName: string = 'venders';
  private ledgerAccountId: number = null;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();

  private vendors: Array<VendorModel>;
  private _filteredValue: VendorFilterArguments = new VendorFilterArguments();

  private sorting: any = {
    column: 'VendorName', //to match the variable of one of the columns
    descending: false
  };
  constructor(
    private vendorSevice: VendorService,
    private accountService: AccountService,
    private masterService: MasterService,
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.vendors = new Array<VendorModel>();
  }


   ngOnInit(): void {
   
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   ngAfterViewInit(){
      if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

   convertSorting() {
    return this.sorting.descending ? '-' + this.sorting.column : this.sorting.column;
  }

  selectedClass(columnName) {
    return columnName == this.sorting.column ? 'sort-' + this.sorting.descending : false;
  }

  changeSorting(columnName): void {
    var sort = this.sorting;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getVendors();
  }

  private get filteredValue(): VendorFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: VendorFilterArguments) {
    this._filteredValue = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.companyId + ','
      + this.filteredValue.vendorKey + ','
      + this.filteredValue.vendorName;
    this.getVendors();
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.companyId + ','
      + this.filteredValue.vendorKey + ','
      + this.filteredValue.vendorName;
    this.currentPageFiltered = newValue;
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let pageSizeFilter = params['pageSizeFilter'] ? params['pageSizeFilter'] : '-1';
      let searchParameters = params['searchParameters'] ? params['searchParameters'] : '-1';
      if (params['id'] !== undefined) {
        this.filteredValue.companyId = params['id'];
      }
      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.filteredValue.companyId = Number(parameterArray[0]);
        this.filteredValue.vendorKey = parameterArray[1];
        this.filteredValue.vendorName = parameterArray[2];
      } else {
        this.filteredValue.companyId = 0;
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.filteredValue.companyId + ','
        + this.filteredValue.vendorKey + ','
        + this.filteredValue.vendorName;

      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getVendors();
    });
  }

  private getVendors() {

    this.location.replaceState('vendor/' + this.searchString);
    return new Promise((resolve, reject) => {
    this.vendorSevice
      .getVendors(
      this.ledgerAccountId,
      this._filteredValue.companyId,
      this._filteredValue.vendorName,
      this._filteredValue.vendorKey,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter)
      .then((result) => {
        if (result) {
          this.vendors = result;
          if (this.vendors && this.vendors.length > 0) {
            this.totalItems = this.vendors[0].VendorsCount;
          } else {
            this.totalItems = 0;
          }
        }
      });
    });
  }

  // private searchUrl(): void {
  //   let link = ['/vendor', this._filteredValue.companyId + ',' + this._filteredValue.vendorKey + ',' + this._filteredValue.vendorName];
  //   this.router.navigate(link);
  // }

  public onFiltered(filteredValue: VendorFilterArguments): void {
    this.filteredValue = filteredValue;
  }

}



