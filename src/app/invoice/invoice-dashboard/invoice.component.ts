import { Component, OnInit, Input ,AfterViewInit} from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ApiUrl } from '../../config.component';
import { InvoiceModel } from '../shared/invoice.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { MasterService } from '../../shared/services/master/master.service';
import { InvoiceFilteredArgs } from './filter-bar.component';
import { InvoiceService } from '../shared/invoice.service';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';
import { CurrentPageArguments } from '../../pagination/pagination.component';


import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

import * as moment from 'moment/moment';

@Component({
  selector: 'sp-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['../../dashboard/css/dashboard-invoices-distribution.css']
})

export class InvoiceComponent extends BaseComponent implements OnInit , AfterViewInit {

  private showLoader:boolean;
  private pageName: string = 'invoices';
  private account: Object;
  private totalItems: number = 0;
  private searchString: string = '';
  private pageSizeFilter: number = 0;
  private searchParameters: number = 0;
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _currentInvoiceArgs: InvoiceFilteredArgs = new InvoiceFilteredArgs();
  private invoiceNumber: string = '';
  private invoiceDesc: string = '';
  private vendorID: number = 0;
  private companyID: number = 0;
  private statusID: number = -1;
  private userID: number = -1;
  private currentPage: number = 0;
  private Invoices: Array<InvoiceModel> = [];
  private isAllInvoiceSelected: boolean;
  private SelectInoivcesSpan: string = '';
  private datefURL:string= '';
  private datetURL:string = '';
   private sorting: any = {
    column: 'InvoiceStatus', //to match the variable of one of the columns
    descending: true
  };
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastsManager,
    private masterService: MasterService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.Invoices = new Array<InvoiceModel>();
    this.pageSizeFilter = 25;
    this.searchParameters = -1;
    this.isAllInvoiceSelected = false;
    this.SelectInoivcesSpan = 'Select All';
  }

 ngOnInit(): void {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   ngAfterViewInit() {
      if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }
  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }
  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
     this.datefURL = '';
      this.datetURL = '';
     if(this.invoiceFilteredValue.datefURL !== undefined && this.invoiceFilteredValue.datefURL !== null){
       this.datefURL =  this.invoiceFilteredValue.datefURL.toDateString();
      }

      if(this.invoiceFilteredValue.datetURL !== undefined && this.invoiceFilteredValue.datetURL !== null){
       this.datetURL =  this.invoiceFilteredValue.datetURL.toDateString();
      }
    
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.datefURL + ','
      + this.datetURL + ','
      + this.invoiceFilteredValue.invoiceDesc + ','
      + this.invoiceFilteredValue.invoiceNumber + ','
      + this.invoiceFilteredValue.companyId + ','
      + this.invoiceFilteredValue.vendorId + ','
      + this.invoiceFilteredValue.statusId + ','
      + this.invoiceFilteredValue.userId;
    this.getInvoices();
  }

  private get invoiceFilteredValue(): InvoiceFilteredArgs {
    return this._currentInvoiceArgs;
  }

  private set invoiceFilteredValue(newValue: InvoiceFilteredArgs) {
    this._currentInvoiceArgs = newValue;
    this.datefURL = '';
    this.datetURL = '';
     if (this.invoiceFilteredValue.datefURL !== undefined && this.invoiceFilteredValue.datefURL !== null){
       this.datefURL =  encodeURIComponent(this.invoiceFilteredValue.datefURL.toDateString())
      }

      if(this.invoiceFilteredValue.datetURL !== undefined && this.invoiceFilteredValue.datetURL !== null){
       this.datetURL =  encodeURIComponent(this.invoiceFilteredValue.datetURL.toDateString())
      }

    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.datefURL + ','
      + this.datetURL  + ','
      + this.invoiceFilteredValue.invoiceDesc + ','
      + this.invoiceFilteredValue.invoiceNumber + ','
      + this.invoiceFilteredValue.companyId + ','
      + this.invoiceFilteredValue.vendorId + ','
      + this.invoiceFilteredValue.statusId + ','
      + this.invoiceFilteredValue.userId;

    this.getInvoices();
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let parameterValue: any = ((params) ? params : 1);
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = parameterValue.searchParameters.split(',');

         if (parameterArray[0] !== undefined && parameterArray[0] !== '') {
             this.invoiceFilteredValue.invFromDate = moment(decodeURIComponent(parameterArray[0])).format('MM/DD/YYYY');
             this.invoiceFilteredValue.datefURL = moment(parameterArray[0], 'MM/DD/YYYY').toDate();
        }

          if (parameterArray[1] !== undefined && parameterArray[1] !== '') {
             this.invoiceFilteredValue.invToDate = moment(decodeURIComponent(parameterArray[1])).format('MM/DD/YYYY');
             this.invoiceFilteredValue.datetURL = moment((parameterArray[1]), 'MM/DD/YYYY').toDate();
        }

        this.invoiceFilteredValue.invoiceDesc = parameterArray[2];
        this.invoiceFilteredValue.invoiceNumber = parameterArray[3];
        this.invoiceFilteredValue.companyId = Number(parameterArray[4]);
        this.invoiceFilteredValue.vendorId = Number(parameterArray[5]);
        this.invoiceFilteredValue.statusId = Number(parameterArray[6]);
        this.invoiceFilteredValue.userId = Number(parameterArray[7]);
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + encodeURIComponent(this.invoiceFilteredValue.invFromDate) + ','
        + encodeURIComponent(this.invoiceFilteredValue.invToDate) + ','
        + this.invoiceFilteredValue.invoiceDesc + ','
        + this.invoiceFilteredValue.invoiceNumber + ','
        + this.invoiceFilteredValue.companyId + ','
        + this.invoiceFilteredValue.vendorId + ','
        + this.invoiceFilteredValue.statusId + ','
        + this.invoiceFilteredValue.userId;

      this.getAccountName();
    });
  }

  private showInvoiceDetail(invoiceID): void {

    if (this.invoiceNumber === '' || this.invoiceNumber === 'null' || this.invoiceNumber === undefined) {
      this.invoiceNumber = null;
    }
    this.router.navigate(['/invoice/detail/'  + this.searchString + '/' + invoiceID + '/' 
                    + this.invoiceNumber + '/' + this.vendorID + '/' + this.companyID + '/' + this.statusID + '/' + this.userID]);
  }
  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getInvoices();
    });
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }

  getInvoices() {

     this.location.replaceState('invoice/' + this.searchString);

    let searchFields = {
      invoiceNumber: this._currentInvoiceArgs.invoiceNumber,
      vendorId: this._currentInvoiceArgs.vendorId,
      companyId: this._currentInvoiceArgs.companyId,
      statusId: this._currentInvoiceArgs.statusId,
      userId: this._currentInvoiceArgs.userId,
      currentPage: this._currentPage.pageNo,
      pageSize: this._currentPage.pageSizeFilter,
      invFromDate: this._currentInvoiceArgs.invFromDate,
      invToDate: this._currentInvoiceArgs.invToDate,
      invoiceDesc: this._currentInvoiceArgs.invoiceDesc,
    };
    return new Promise((resolve, reject) => {
    this.invoiceService.getInvoices(searchFields).then(result => {
       if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
         this.Invoices = result;
      if (this.Invoices[0] && this.Invoices[0].InvoiceCount) {
        this.totalItems = this.Invoices[0].InvoiceCount;
      }
      if (this.Invoices.length === 0) {
       this.totalItems = 0;
      }
      }
      });
    });
  }

  unlockInvoice(item) {
    this.masterService.unlockDocument(item.InvoiceID, this.user.userId, 10).then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.toastr.success('Invoice unlock successfully', 'Success!');
        this.getInvoices();
      }

    });
  }

  SelectAllInvoice() {
    if (this.isAllInvoiceSelected == true) {
      for (var i = 0; i < this.Invoices.length; i++) {
        this.Invoices[i].IsInoiveSelected = true;
      }
      this.SelectInoivcesSpan = "Deselect All";
    }
    else {
      for (var i = 0; i < this.Invoices.length; i++) {
        this.Invoices[i].IsInoiveSelected = false;
      }
      this.SelectInoivcesSpan = "Select All";
    }


  }


  private ExporPdf() {
    var invPdfs = '';
    var invCompany = '';

    for (var i = 0; i < this.Invoices.length; i++) {
      if (this.Invoices[i].IsInoiveSelected == true) {
        if (invPdfs == '') {
          invPdfs = this.Invoices[i].AttachmentName;
          invCompany = this.Invoices[i].CompanyNumber;
        }
        else {
          invPdfs = invPdfs + ',' + this.Invoices[i].AttachmentName;
          invCompany = invCompany + ',' + this.Invoices[i].CompanyNumber;
        }
      }


    }

    if ((invPdfs != "" && invPdfs != null) && (invCompany != null && invCompany != "")) {
      let apiServiceBase = ApiUrl.baseUrl;
      window.open(apiServiceBase + "api/invoices/GetExportSelectedInvoicePdf?invPdfs=" + invPdfs + '&invCompany=' + invCompany);
    }
    else {
      this.toastr.error("Invoice", "Please select one of the invoice to export pdf", "error");
    }
  }

  public onFilteredInvoice(filteredValue: InvoiceFilteredArgs): void {
    this.invoiceFilteredValue = filteredValue;
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


  

}
