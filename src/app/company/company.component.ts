import { Component } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { MasterService } from "../shared/services/master/master.service";
import { CompanyService } from "./company.service";
import { AccountService } from "../account/shared/account.service";

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';


@Component({
    selector: 'skp-company',
    templateUrl: './company.component.html',
    providers: [MasterService, CompanyService, AccountService],


})
export class CompanyComponent {
    syncList: Array<any> = [];
    skyPanionTypeList: Array<any> = [];
    pageSizeFilter: number = 25;
    pageName: string = 'companies';
    dataObj:Object={};
    /*
         filter maintenance starts
     */
    currentPage: number = 1;
    pageSize: number = 25;
    syncID: string = '-1';
    syncTypeID: string = '-1';
    searchText: string = "";
    syncName: string = "Sync Type";
    companyType: string = "Company Type";
    title: string = 'Companies';
    gridData : Array<any> = [];

    options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ prop: 'Number' }),
            // new TableColumn({ prop: 'Name' }),
            new TableColumn({name:'Sync', prop: 'ActivationLink' }),
            new TableColumn({ prop: 'Details' })
        ]
    });

    constructor(private masterService: MasterService, private companyService: CompanyService, private accountService: AccountService) {
        this.getXML();
    }
    private searchURLReset = function () {
        this.currentPage = 1;
        this.pageSize = 25;
        this.syncID = '-1';
        this.syncTypeID = '-1';
        this.searchText = "";
        this.searchURL();
    }
    private getItemsPerPageList = function () {
        this.itemsPerPageList = this.masterService.getItemsPerPageList();
        this.pageSize = 25;
        this.pageSizeFilter = 25;
        this.getSessionDetails();
    }
    private getSessionDetails = function () {
        //this.sessionDetails = userService.getSessionDetails();
        //if ($rootScope.sessionDetails.UserID != null) {
        //if ($rootScope.sessionDetails.IsSuperUser == true) {
        //$scope.getAccountName();
        //}
        // else {
        // window.location.href = "/#/dashboard";
        // }
        // }
        this.getAccountName();
    }

    private getAccountName = function () {
        this.accountService.getAccountName().subscribe(result => {
            if (result.status == 404 || result.status == 500) {
            }
            else {
                this.account = result.data;
                this.getSyncList();
            }
        });
    }

    private getXML=function(){

         this.companyService
            .getXML().subscribe(result => {
           this.dataObj=result;
         }) 
    }

    private getSyncList = function () {
        var item = [{ ID: "all", Name: "All" }, { ID: "true", Name: "Sync Enabled" }, { ID: "false", Name: "Sync Disabled" }];
        for (var i = 0; i < 3; i++) {
            this.syncList.splice(i, 0, item[i]);

            this.syncList.forEach((item) => {
                if (item.ID == this.syncID) {
                    this.syncName = item.Name;
                }
            });
        }
        this.getSkyPanionType();
    }

    private getSkyPanionType = function () {
        var item = [{ ID: "all", Name: "All" }, { ID: "Fund", Name: "Fund" }, { ID: "Property", Name: "Property" }];
        for (var i = 0; i < 3; i++) {
            this.skyPanionTypeList.splice(i, 0, item[i]);

            this.skyPanionTypeList.forEach((item) => {
                if (item.ID == this.syncTypeID) {
                    this.companyType = item.Name;
                }
            });
        }
        this.getXML();
    }

    private selectSync = function (id) {
        this.syncList.forEach((item) => {
            if (item.ID == id) {
                this.syncID = id;
                this.syncName = item.Name;
            }
        });
    }

    private selectCompanyType = function (id) {
        this.skyPanionTypeList.forEach((item) => {
            if (item.ID == id) {
                this.syncTypeID = id;
                this.companyType = item.Name;
            }
        });
    }
    private getDataAsPerPageRequired = function (value) {
        if (value != undefined && value != null) {
            this.pageSizeFilter = value;
            this.currentPage = 1;
            this.getCompanies();
            //var instanseId = paginationService.getLastInstanceId();
            //paginationService.setCurrentPage(instanseId, this.currentPage);
        }
    }
    private getCompanies = function () {

        if (this.pageSizeFilter != null) {
            this.pageSize = this.pageSizeFilter;
        }

        if (this.searchText == "" || this.searchText == undefined || this.searchText == "null") {
            this.searchText = null;
        }

        this.syncList.forEach((item) => {
            if (item.ID == this.syncID) {
                this.syncName = item.Name;
            }
        });

        this.skyPanionTypeList.forEach((item) => {
            if (item.ID == this.syncTypeID) {
                this.companyType = item.Name;
            }
        });

        this.companyService
            .getCompanies(this.syncID,
            this.syncTypeID,
            this.searchText,
            this.currentPage,
            this.pageSize)
            .subscribe(result => {
                if (result.status == 404) {
                    this.gridData = [];
                    this.totalItems = 0;
                }
                else if (result.status == 500) {
                }
                else {
                    this.gridData = result;
                    this.totalItems = this.gridData[0].CompanyCount;

                    this.gridData.forEach((item) => {   
                        if (item.type == "Skypanion::Property") {
                            // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> " + item.LedgerAccountCount + "<br /><b>Invoices:</b> " + item.InvoiceCount + "<br /><b>Vendors:</b> " + item.VendorCount + "<br /><b>PDFs:</b> " + item.PDFCount + "<br /><b>Purchase Orders:</b> " + item.PurchaseOrderCount + "<br /><b>Approval Criteria:</b> " + item.ApprovalCriteriaCount + "<br />");
                        }
                        else {
                            // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> " + item.LedgerAccountCount + "<br /><b>Invoices:</b> " + item.InvoiceCount + "<br /><b>Vendors:</b> " + item.VendorCount + "<br /><b>PDFs:</b> " + item.PDFCount + "<br /><b>Purchase Orders:</b> " + item.PurchaseOrderCount + "<br /><b>Approval Criteria:</b> " + item.ApprovalCriteriaCount + "<br /><b>Posts:</b> " + item.FundCount + "<br />");
                        }
                    });
                }
                /// var instanseId = paginationService.getLastInstanceId();
                ///  paginationService.setCurrentPage(instanseId, $scope.currentPage);
            });
    }














}
