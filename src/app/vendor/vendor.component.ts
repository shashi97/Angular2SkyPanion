import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Angular2DataTableModule } from 'angular2-data-table';
import { VendorService } from './shared/vendor.service';
import { VendorModel } from './shared/vendor.model';
import { CompaniesService } from '../companies/shared/companies.service';
import { MasterService } from '../shared/services/master/master.service';
import { AccountService } from '../account/shared/account.service';
import { BaseComponent } from '../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-vendorDetail',
  templateUrl: './vendor.component.html',
})

export class VendorComponent extends BaseComponent implements OnInit {

  private companies: Array<any>;
  private account: Object;
  private ledgerAccountID: number = 0;
  private companyId: number = 0;
  private vendorName: string = null;
  private currentPage: number = 1;
  private pageSize: number = 25;
  private pageSizeFilter: number = 25;
  private vendorKey: string = null;
  private totalItems: number = 0;
  private itemsPerPageList: Array<any>;
  private pageName: string = 'venders';

  private vendorModel: VendorModel;

  options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    columns: [
      new TableColumn({ name: 'Vendor Key', prop: 'VendorKey' }),
      new TableColumn({ name: 'Name', prop: 'VendorName' }),
      new TableColumn({ name: 'Account Number', prop: 'AccountNumber' }),
      new TableColumn({ name: 'Company Name', prop: 'CompanyName' }),
      new TableColumn({ name: 'Phone #', prop: 'PhoneNumber' })
    ]
  });

  constructor(
    private vendorSevice: VendorService,
    private companiesService: CompaniesService,
    private accountService: AccountService,
    private masterService: MasterService,
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.vendorModel = new VendorModel();
    this.getParameterValues();
  }

  ngOnInit() {

  }

  private getParameterValues(): void {
    let searchParam = this.activatedRoute.params.subscribe(params => {
      let searchParameters = params['searchParameters'];
      if (searchParameters) {
        var parameterArray = searchParameters.split(',');
        this.companyId = parseInt(parameterArray[0]);
        this.vendorKey = parameterArray[1] == 'null' ? null : parameterArray[1];
        this.vendorName = parameterArray[2] == 'null' ? null : parameterArray[2];
      }
      this.getItemsPerPageList();
    });
  }

  getItemsPerPageList(): void {
    this.itemsPerPageList = this.masterService.getItemsPerPageList();
    this.getCompanyDDOs();
  }

  private getCompanyDDOs(): void {
    this.companiesService.getCompanyDDOs().then((result) => {
      if (result.status == 404 || result.status == 500) {
      }
      else {
        this.companies = result;
        var obj = { CompanyID: 0, Number: 'None', CompanyName: 'None', Type: 'None', AccountID: 0 };
        this.companies.splice(0, 0, obj);
      }
      this.getAccountName();
    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then((result) => {     
        this.account = result;
        this.getVendors();      
    });
  }

  private getVendors() {
    this.ledgerAccountID = 0;
    // if ($scope.pageSizeFilter != null) {
    //   $scope.pageSize = $scope.pageSizeFilter;
    // }
    this.companies.forEach((item) => {
      if (item.CompanyID == this.companyId) {
        // $scope.selectedCompany.selected = item;
      }
    });

    this.vendorSevice.getVendors(this.ledgerAccountID,
      this.companyId,
      this.vendorName,
      this.vendorKey,
      this.currentPage,
      this.pageSize)
      .then((result) => {
        if (result) {
          this.vendorModel.vendorGridArray = result;
          if (this.vendorModel.vendorGridArray) {
            if (this.vendorModel.vendorGridArray.length > 0) {
              this.totalItems = this.vendorModel.vendorGridArray[0].VendorsCount;
            }
          }
          else {
            this.totalItems = 0;
          }
        }
        // var instanseId = paginationService.getLastInstanceId();
        // paginationService.setCurrentPage(instanseId, $scope.currentPage);
      });
  }

  private searchURL(): void {
    if (this.vendorKey == '' || this.vendorKey == 'null') {
      this.vendorKey = null;
    }
    if (this.vendorName == '' || this.vendorName == 'null') {
      this.vendorName = null;
    }
    let link = ['/vendor', this.companyId + ',' + this.vendorKey + ',' + this.vendorName];
    this.router.navigate(link);
    // $location.path('/vendors/' + this.companyId + ',' + this.vendorKey + ',' + this.vendorName);
  }

  private searchURLReset(): void {
    this.currentPage = 1;
    this.pageSize = 25;
    this.vendorName = '';
    this.vendorKey = '';
    this.companyId = 0;
    this.searchURL();
  }

}



