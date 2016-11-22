import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorDetail } from './shared/vendor.model';

import { DashboardService } from '../dashboard/shared/dashboard.service';
import { MasterService } from '../shared/services/master/master.service';
import { VendorService } from './shared/vendor.service';

@Component({
    selector: 'sp-vendor',
    templateUrl: './vendor-detail.component.html',
})

export class VendorDetailComponent extends BaseComponent implements OnInit {

    private companies: Array<any>;
    private itemsPerPageList: Array<any>;
    private pageSize: number = 25;
    private pageSizeFilter: number = 25;
    private currentPage: number = 1;
    private totalItems: number = 0;
    // private companyId: number = 0;
    // private vendorId: number = 0;
    // private vendorName: string = null;
    // private vendorKey: string = null;
    private vendorDetail: VendorDetail;

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private masterService: MasterService,
        private vendorService: VendorService
    ) {
        super(localStorageService, router);
        this.vendorDetail = new VendorDetail();
        this.getParameterValues();
    }

    ngOnInit() {
    }

    private getParameterValues(): void {
        let searchParam = this.activatedRoute.params.subscribe(params => {
            this.vendorDetail.VendorID = params['vendorId'];
            let searchParameters = params['searchParameters'];
            if (searchParameters) {
                var parameterArray = searchParameters.split(',');
                this.vendorDetail.CompanyID = parseInt(parameterArray[0]);
                this.vendorDetail.VendorID = parameterArray[1] == 'null' ? null : parameterArray[1];
                this.vendorDetail.VendorName = parameterArray[2] == 'null' ? null : parameterArray[2];
            }
            this.getSkypanionsCompanies();
        });
    }

    getSkypanionsCompanies(): void {
        this.dashboardService.getSkypanionsCompanies().then((result) => {
            this.companies = result;
            this.getItemsPerPageList();
        });
    }

    getItemsPerPageList(): void {
        this.itemsPerPageList = this.masterService.getItemsPerPageList();
        this.pageSize = 25;
        this.pageSizeFilter = 25;
        this.getVendorDetail(this.vendorDetail.VendorID, this.vendorDetail.CompanyID);
    }

    getVendorDetail(vendorId: number, companyId: number): void {
        var self = this;
        this.vendorService.getVendorDetail(vendorId, companyId, this.currentPage, this.pageSize).then((result) => {
            this.vendorDetail = result;
            this.totalItems = 0;
            if (this.vendorDetail.VendorInvoices.length > 0) {
                this.totalItems = this.vendorDetail.VendorInvoices[0].TotalCount;
            }
            if (this.vendorDetail.glAccount.AccountTitle == "" || this.vendorDetail.glAccount.AccountTitle == null) {
                this.vendorDetail.glAccount.AccountTitle = 'Unknown';
            }
        });
    }

    private searchByCompany(): void {
        this.getVendorDetail(this.vendorDetail.VendorID, this.vendorDetail.CompanyID);
    }

    private resetSearch(): void {
        this.vendorDetail.CompanyID = 0;
        this.getVendorDetail(this.vendorDetail.VendorID, this.vendorDetail.CompanyID);
    }
}