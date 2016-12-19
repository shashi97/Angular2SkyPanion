import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '../shared/company.service';
import { CompanyModel } from '../shared/company.model';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { AccountService } from '../../account/shared/account.service';
import { UserService } from '../../user/shared/user.service';

import { BaseComponent } from '../../base.component';

import { CompanyFilterArguments } from './filter-bar.component';
import { CurrentPageArguments } from '../../pagination/pagination.component';


@Component({
  selector: 'sp-companies',
  templateUrl: './company.component.html',
  providers: [CompanyService]
})

export class CompanyComponent extends BaseComponent implements OnInit {

  private account: Object;
  private companies: Array<CompanyModel>;
  private searchString: string = '';

  private pageName: string = 'Companies';
  private totalItems: number;

  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private _filteredValue: CompanyFilterArguments = new CompanyFilterArguments();

  private skyPanionTypeList: Array<any> = [];

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public confirmService: ConfirmService,
    public accountService: AccountService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    super(localStorageService, router);
    this.skyPanionTypeList = new Array<any>();
    this.companies = new Array<CompanyModel>();
  }

  ngOnInit(): void {
    if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private get filteredValue(): CompanyFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: CompanyFilterArguments) {
    this._filteredValue = newValue;

    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.searchText + ','
      + this.filteredValue.syncId + ','
      + this.filteredValue.syncTypeId;
    this.getCompanies();
  }

  private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
      + this.filteredValue.searchText + ','
      + this.filteredValue.syncId + ','
      + this.filteredValue.syncTypeId;
    this.getCompanies();
  }

  private getParameterValues(): void {
    this.route.params.subscribe(params => {
      let pageSizeFilter = params['pageSizeFilter'];
      let searchParameters = params['searchParameters'];

      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.filteredValue.searchText = parameterArray[0];
        this.filteredValue.syncId = parameterArray[1];
        this.filteredValue.syncTypeId = parameterArray[2];
      }

      if (pageSizeFilter !== '-1') {
        this.currentPageFiltered.pageSizeFilter = pageSizeFilter;
      }

      this.searchString = this.currentPageFiltered.pageSizeFilter + '/'
        + this.filteredValue.searchText + ','
        + this.filteredValue.syncId + ','
        + this.filteredValue.syncTypeId;

      this.getAccountName();

    });
  }

  private getAccountName(): void {
    this.accountService.getAccountName().then(result => {
      this.account = result;
      this.getCompanies();
    });
  }


  private getCompanies() {

    this.location.replaceState('company/' + this.searchString);

    this.companyService
      .getCompanies(
      this.filteredValue.syncId,
      this.filteredValue.syncTypeId,
      this.filteredValue.searchText,
      this.currentPageFiltered.pageNo,
      this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result.status === 404) {
          this.companies = new Array<CompanyModel>();
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
        // this.getSessionDetails();
      });
  }


  public onFiltered(filteredValue: CompanyFilterArguments): void {
    this.filteredValue = filteredValue;
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }
}

