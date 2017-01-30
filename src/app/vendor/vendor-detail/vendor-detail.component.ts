import { Component, OnInit , AfterViewInit } from '@angular/core';
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

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-vendor',
  templateUrl: './vendor-detail.component.html',
})

export class VendorDetailComponent extends BaseComponent implements OnInit , AfterViewInit {

  private itemsPerPageList: Array<any>;
  private pageSize: number = 25;
  private pageSizeFilter: number = 25;
  private totalItems: number = 0;
  private vendorDetail: VendorModel;
  private vendorId: number = 0;
  private searchString: string = '';
  private showLoader:boolean;
  private _filteredValue: VendorFilterArguments = new VendorFilterArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private vendorService: VendorService,
    public pubsub: PubSubService) {
    super(localStorageService, router);
    this.vendorDetail = new VendorModel();
  }

  ngOnInit() {
     this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

    ngAfterViewInit(){
  this.getParameterValues();
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
      let parameterValue: any = ((params) ? params : 1);
      this.vendorId = params['id'];
      let searchParameters = params['searchParameters'];
      this.pageSizeFilter = params['pageSizeFilter'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');
        this.filteredValue.companyId = Number(parameterArray[0]);
      }

      this.searchString = this.vendorId + '/' + this.pageSizeFilter + '/' + this.filteredValue.companyId;

      this.getItemsPerPageList();
    });
  }

  private getItemsPerPageList(): void {
    this.itemsPerPageList = this.masterService.getItemsPerPageList();
    this.pageSize = 25;
    this.pageSizeFilter = 25;
    this.getVendorDetail();
  }

  private getVendorDetail() {
    return new Promise((resolve, reject) => {
    this.vendorService.getVendorDetail(this.vendorId, this._filteredValue.companyId, 1, 25).then((result) => {
      this.vendorDetail = result;
      this.totalItems = 0;
      if (this.vendorDetail.VendorInvoices.length > 0) {
        this.totalItems = this.vendorDetail.VendorInvoices[0].TotalCount;
      }
      if (this.vendorDetail.glAccount.AccountTitle == undefined || this.vendorDetail.glAccount.AccountTitle === '' || this.vendorDetail.glAccount.AccountTitle == null) {
        this.vendorDetail.glAccount.AccountTitle = 'Unknown';
      }
      });
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
