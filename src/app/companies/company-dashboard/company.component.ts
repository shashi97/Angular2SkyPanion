import { Component, OnInit } from '@angular/core';
 import { LocalStorageService } from 'angular-2-local-storage';
 import { Router } from '@angular/router';
 import { ActivatedRoute } from '@angular/router';

 import { CompanyService } from '../shared/company.service';
 import { CompanyModel } from '../shared/company.model';
 import { UserService } from '../../user/shared/user.service';
 import { BaseComponent } from '../../base.component';
 import { ConfirmService } from '../../shared/services/otherServices/confirmService';
 import {CurrentPageArguments} from '../../pagination/pagination.component';
 import { AccountService } from '../../account/shared/account.service';

 import {
   TableOptions,
   TableColumn,
   ColumnMode
 } from 'angular2-data-table';

 @Component({
   selector: 'spcompanies',
   templateUrl: './company.component.html',
   providers: [CompanyService]
 })
 export class CompanyComponent extends BaseComponent implements OnInit {
   options = new TableOptions({
     columnMode: ColumnMode.force,
     headerHeight: 50,
     footerHeight: 50,
     rowHeight: 'auto',
     columns: [
       new TableColumn({ prop: 'Number', cellTemplate: '' }),
       new TableColumn({ name: 'Name', prop: 'Name' }),
       new TableColumn({ prop: 'Sync' })
     ]
   });

   private account: Object;
   private syncID: string= '-1' ;
   private syncTypeID: string= '-1' ;
   private searchText: string = '';
   private _currentPage: CurrentPageArguments = new CurrentPageArguments();
   private company: CompanyModel;
   private companies: Array<any>;
   private totalItems: number;
   private pageName: string = 'Companies';
   public parameterValue: any;

   private syncList: Array<any> = [];
   private skyPanionTypeList: Array<any> = [];
   constructor(
     private companyService: CompanyService,
     private userService: UserService,
     public localStorageService: LocalStorageService,
     public router: Router,
     public confirmService: ConfirmService,
     public accountService: AccountService,
     private route: ActivatedRoute
   ) {
     super(localStorageService, router);
     this.syncList = new Array<any>();
     this.skyPanionTypeList = new Array<any>();
     this.companies = new Array<any>();
     this.company = new CompanyModel();
     this.getSessionDetails();
   }
   ngOnInit(): void { }



   private get currentPageFiltered(): CurrentPageArguments {
     return this._currentPage;
   }
   private set currentPageFiltered(newValue: CurrentPageArguments) {
     this._currentPage = newValue;
     this.getCompanies();
   }

   private getSessionDetails(): void {
     this.sessionDetails = this.userService.getSessionDetails();
     if (this.sessionDetails.userId != null) {
       this.getParameterValues();
     } else {
       let link = ['/login'];
       this.router.navigate(link);
     }
   }

   private getParameterValues(): void {
     this.route.params.subscribe(params => {
       this.parameterValue = ((params) ? params : 1);
       if (this.parameterValue.searchParameters) {
         let parameterArray: Array<string> = this.parameterValue.searchParameters.split(',');
         this.searchText = parameterArray[0];
         this.syncID = parameterArray[1];
         this.syncTypeID = parameterArray[2];
       }
       this.getAccountName();
     });
   }
   private getAccountName(): void {
     this.accountService.getAccountName().then(result => {
       this.account = result;
       this.getCompanies();
     });
   }
   public onCurrentPageChanged(newValue: CurrentPageArguments) {
     this.currentPageFiltered = newValue;
   }

   private getCompanies() {
     this.companyService
       .getCompanies(this.syncID,
       this.syncTypeID,
       this.searchText,
       this.currentPageFiltered.pageNo,
       this.currentPageFiltered.pageSizeFilter)
       .then(result => {
         if (result.status === 404) {
           this.companies = new Array<any>();
           this.totalItems = 0;
         } else if (result.status === 500) {
         } else {
           this.companies = result;
           if (this.companies && this.companies.length > 0) {
             this.totalItems = this.companies[0].CompanyCount;

           } else {
             this.totalItems = 0;

           }

           this.companies.forEach((item) => {
             if (item.type === 'Skypanion::Property') {
               // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> "
               //     + item.LedgerAccountCount + 
               //     "<br /><b>Invoices:</b> "
               //     + item.InvoiceCount
               //     + "<br /><b>Vendors:</b> "
               //     + item.VendorCount 
               //     + "<br /><b>PDFs:</b> " 
               //     + item.PDFCount 
               //     + "<br /><b>Purchase Orders:</b> " 
               //     + item.PurchaseOrderCount 
               //     + "<br /><b>Approval Criteria:</b> " 
               //     + item.ApprovalCriteriaCount + "<br />");
             } else {
               // // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> " 
               // + item.LedgerAccountCount 
               // + "<br /><b>Invoices:</b> " 
               // + item.InvoiceCount 
               // + "<br /><b>Vendors:</b> " 
               // + item.VendorCount 
               // + "<br /><b>PDFs:</b> " 
               // + item.PDFCount 
               // + "<br /><b>Purchase Orders:</b> " 
               // + item.PurchaseOrderCount 
               // + "<br /><b>Approval Criteria:</b> " 
               // + item.ApprovalCriteriaCount 
               // + "<br /><b>Posts:</b> " 
               // + item.FundCount + "<br />");
             }
           });
         }
         this.searchText = '';
         });
   }

   private activateDeactiveCompany(companyName: string, CompanyId: number, Active: boolean): void {
     let isActive = null;
     if (Active === true) {
       let message = 'Are you Sure you' + 'd like to disable property ';
       if (this.confirmService.confermMessage(message, companyName)) {
         isActive = false;
         this.disableProperty(CompanyId, isActive);
       }
     } else {
       let message = 'Are you Sure you' + 'd like to enable property ';
       if (this.confirmService.confermMessage(message, companyName)) {
         isActive = true;
         this.disableProperty(CompanyId, isActive);
       }

     }
   }

   private disableProperty(CompanyId: number, isActive: boolean): void {
     this.companyService
       .activateDeactiveCompany(CompanyId, isActive)
       .then((result) => {
         this.getSessionDetails();
       });
   }
 }
