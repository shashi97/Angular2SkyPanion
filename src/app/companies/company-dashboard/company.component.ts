import { Component, OnInit, AfterViewInit , ViewContainerRef } from '@angular/core';
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

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
import {
  confirmationModalContext,
  confirmationModalComponent
} from '../../shared/confirmation-modal/confirmation-modal.component';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
@Component({
  selector: 'sp-companies',
  templateUrl: './company.component.html',
  providers: [CompanyService]
})

export class CompanyComponent extends BaseComponent implements OnInit, AfterViewInit {

  private account: Object;
  private companies: Array<CompanyModel>;
  private searchString: string = '';
  private showLoader: boolean;
  private header: string = "";
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
    overlay: Overlay, public modal: Modal,
    public confirmService: ConfirmService,
    public accountService: AccountService,
    private route: ActivatedRoute,
    private location: Location,
    public pubsub: PubSubService,
    public vcRef: ViewContainerRef
  ) {
    super(localStorageService, router);
    this.skyPanionTypeList = new Array<any>();
    this.companies = new Array<CompanyModel>();
    overlay.defaultViewContainer = vcRef;
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
    return new Promise((resolve, reject) => {
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
    });
  }

  private activateDeactiveCompany(companyName: string, CompanyId: number, Active: boolean): void {
    let isActive = null;
    if (Active === true) {
      isActive = false;
      this.header = 'Are you Sure you' + 'd like to disable property ';
      this.ChangeStateConfirmationModal(CompanyId, isActive);
    } else {
      isActive = true;
      this.header = 'Are you Sure you' + 'd like to enable property ';
      this.ChangeStateConfirmationModal(CompanyId, isActive);

    }
  }

  ChangeStateConfirmationModal(CompanyId, isActive) {
    const builder = new BSModalContextBuilder<confirmationModalContext>(
      { header: this.header } as any,
      undefined,
      confirmationModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(confirmationModalComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result === "true") {
          this.disableProperty(CompanyId, isActive);
        }
      }, () => console.log(' user canceled logout modal '));
    });


  }

  private disableProperty(CompanyId: number, isActive: boolean): void {
    this.companyService
      .activateDeactiveCompany(CompanyId, isActive)
      .then((result) => {
        this.getCompanies();
      });
  }


  public onFiltered(filteredValue: CompanyFilterArguments): void {
    this.filteredValue = filteredValue;
  }

  public onCurrentPageChanged(newValue: CurrentPageArguments) {
    this.currentPageFiltered = newValue;
  }
}

