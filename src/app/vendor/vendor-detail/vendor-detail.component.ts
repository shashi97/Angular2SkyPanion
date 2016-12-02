import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorDetailAttributeComponent } from '../vendor-detail/attribute.component';
import { VendorDetailFilterComponent, VendorFilterArguments } from '../vendor-detail/filter-bar.component';
import { VendorDetailInvoiceComponent } from '../vendor-detail/invoice.component';

import { VendorModel } from '../shared/vendor.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { MasterService } from '../../shared/services/master/master.service';
import { VendorService } from '../shared/vendor.service';


@Component({
  selector: 'sp-vendor',
  templateUrl: './vendor-detail.component.html',
})

export class VendorDetailComponent extends BaseComponent implements OnInit {

  private itemsPerPageList: Array<any>;
  private pageSize: number = 25;
  private pageSizeFilter: number = 25;
  private currentPage: number = 1;
  private totalItems: number = 0;
  private vendorDetail: VendorModel;
  private vendorId: number = 0;
  private companyId: number = 0;
  private _filteredValue: VendorFilterArguments = new VendorFilterArguments();
  
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private vendorService: VendorService) {
    super(localStorageService, router);
    this.vendorDetail = new VendorModel();
    this.getParameterValues();
  }

  ngOnInit() {
  }

  private get filteredValue(): VendorFilterArguments {
    return this._filteredValue;
  }
  private set filteredValue(newValue: VendorFilterArguments) {
    this._filteredValue = newValue;
    this.getVendorDetail();
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.vendorId = params['vendorId'];
      this.getItemsPerPageList();
    });
  }

  private getItemsPerPageList(): void {
    this.itemsPerPageList = this.masterService.getItemsPerPageList();
    this.pageSize = 25;
    this.pageSizeFilter = 25;
    this.getVendorDetail();
  }

  private getVendorDetail(): void {
    this.vendorService.getVendorDetail(this.vendorId, this._filteredValue.companyId, 1, 25).then((result) => {
      this.vendorDetail = result;
      this.totalItems = 0;
      if (this.vendorDetail.VendorInvoices.length > 0) {
        this.totalItems = this.vendorDetail.VendorInvoices[0].TotalCount;
      }
      if (this.vendorDetail.glAccount.AccountTitle === '' || this.vendorDetail.glAccount.AccountTitle == null) {
        this.vendorDetail.glAccount.AccountTitle = 'Unknown';
      }
    });
  }

  // private searchByCompany(): void {
  //     this.getVendorDetail(this.vendorDetail.VendorID, this.vendorDetail.CompanyID);
  // }

  // private resetSearch(): void {
  //     this.vendorDetail.CompanyID = 0;
  //     this.getVendorDetail(this.vendorDetail.VendorID, this.vendorDetail.CompanyID);
  // }

  public onFiltered(filteredValue: VendorFilterArguments): void {
    this.filteredValue = filteredValue;
  }
}
