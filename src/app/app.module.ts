import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { routing } from './app.routing';
import { Angular2DataTableModule } from 'angular2-data-table';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpInterceptor } from './shared/httpInterceptor';
import { XHRBackend } from '@angular/http';

import { DataTableModule } from 'angular2-datatable';
import { PaginationComponent } from './pagination/pagination.component';

import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { ConfirmService } from './shared/services/otherServices/confirmService';

import { DropdownModule } from 'primeng/primeng';
import { SelectModule } from 'angular2-select';

/* bootstrap components start */
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
/* bootstrap components end */


/*sp-app services*/
import { MasterService } from './shared/services/master/master.service';
import { UserService } from './user/shared/user.service';
import { AuthService } from './shared/services/otherServices/auth.service';
import { CompanyService } from './companies/shared/company.service';
import { AccountService } from './account/shared/account.service';
import { VendorService } from './vendor/shared/vendor.service';
import { DashboardService } from './dashboard/shared/dashboard.service';
import { LedgerAccountService } from './ledger-account/shared/ledger-account.service';
import { ApprovalCriteriaService } from './approval-criteria/shared/approval-criteria.service';
import { IniSetupService } from './ini-setup/shared/ini-setup.service';
import { RoleService } from './role/shared/role.service';
import { AchSetupService } from './ach-setups/shared/ach-setup.service';
import { InvoiceService } from './invoice/shared/invoice.service';
import { AttachmentService } from './attachment/shared/attachment.service';


/*pipes */
import { OrderByPipe } from './shared/pipe/orderby';

/* sp-app components */
import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';

import { CompanyDetailComponent } from './companies/company-detail/company-detail.component';
import { CompanyTitleComponent } from './companies/company-detail/company-title.component';
import { CompanyComponent } from './companies/company-dashboard/company.component';
import { CompanyFilterComponent } from './companies/company-dashboard/filter-bar.component';
import { AptTotalsComponent } from './companies/company-detail/aptotals.component';
import { CompanyRoleComponent } from './companies/company-detail/company-role.component';

import { VendorComponent } from './vendor/vendor-dashboard/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { VendorDetailFilterComponent } from './vendor/vendor-detail/filter-bar.component';
import { VendorDetailAttributeComponent } from './vendor/vendor-detail/attribute.component';
import { VendorDetailInvoiceComponent } from './vendor/vendor-detail/invoice.component';

import { LedgerAccountComponent } from './ledger-account/ledger-dashboard/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail/ledger-account-detail.component';
import { LedgerFilterComponent } from './ledger-account/ledger-account-detail/filter-bar.component';
import { LedgerAttributeComponent } from './ledger-account/ledger-account-detail/attribute.component';
import { LedgerAccountDistributionComponent } from './ledger-account/ledger-account-detail/account-distribution.component';

import { IniSetupComponent } from './ini-setup/ini-setup.component';

import { JobComponent } from './job/job-dashboard/job.component';
import { JobDetailComponent } from './job/job-detail/job-detail.component';
import { JobAttributeComponent } from './job/job-detail/attribute.component';
import { JobCategoryComponent } from './job/job-detail/category.component';

import { ApprovalCriteriaComponent } from './approval-criteria/approval-dashboard/approval-criteria.component';
import { ApprovalsViewComponent } from './approval-criteria/approval-dashboard/approvals-view.component';
import { ApprovalFilterComponent } from './approval-criteria/approval-dashboard/filter-bar.component';

import { PurchaseOrderComponent } from './purchase-order/purchase-order-dashboard/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';

import { AchSetupComponent } from './ach-setups/ach-setup-dashboard/ach-setup.component';
import { AchSetupDetailComponent } from './ach-setups/ach-setup-detail/ach-setup-detail.component';
import { AchSetupAttributeComponent } from './ach-setups/ach-setup-detail/attribute.component';
import { AchSetupFilterBarComponent } from './ach-setups/ach-setup-detail/filter-bar.component';

import { CompanyDropdownComponent } from './shared/dropdown/company/company-dropdown.component';
import { CompanyPathDropdownComponent } from './shared/dropdown/company-path/company-path.component';
import { SyncTypeDropdownComponent } from './shared/dropdown/sync-type/sync-type.component';

import { VendorDropdownComponent } from './shared/dropdown/vendor/vendor-dropdown.component';
import { VendorFilterComponent } from './vendor/vendor-dashboard/filter-bar.component';
import { UserDropdownComponent } from './shared/dropdown/user/user-dropdown.component';
import { CrumbBarComponent } from './shared/others/crumb-bar/crumb-bar.component';
import { PagerComponent } from './shared/others/pager/pager.component';

import { InvoiceComponent } from './invoice/invoice-dashboard/invoice.component';
import { InvoiceFilterComponent } from './invoice/invoice-dashboard/filter-bar.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { InvoiceDetailFilterComponent } from './invoice/invoice-detail/filter-bar.component';
import { InvoiceDetailAttributeComponent } from './invoice/invoice-detail/attribute.component';
import { InvoiceDetailDistributeComponent } from './invoice/invoice-detail/distribution.component';
import { InvoiceDetailInvoiceComponent } from './invoice/invoice-detail/invoice.component';
import { InvoiceCheckDetailComponent } from './invoice/invoice-detail/check-detail.component';

import { InvoiceEntryComponent } from './invoice/invoice-entry/invoice-entry.component';
import { InvoiceEntryAccountsComponent } from './invoice/invoice-entry-components/accounts-model/invoice-entry-accounts.component';
import { InvoiceEntryDistributionsComponent } from './invoice/invoice-entry-components/distributions-model/invoice-entry-distributions.component';
import { InvoiceEntryPurchaseComponent } from './invoice/invoice-entry-components/purchase-model/invoice-entry-purchase.component';



import { AttachmentComponent } from './attachment/attachment.component';
import { Pagination } from './pagination/directive/pagination.component';


let localStorageServiceConfig = {
  prefix: 'my-app',
  storageType: 'localStorage'
};

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({

  declarations: [
    AppComponent,
    OtherComponent,
    LoginComponent,
    CompanyComponent,
    CompanyFilterComponent,
    CompanyDetailComponent,
    PaginationComponent,
    VendorComponent,
    VendorDetailComponent,
    VendorDetailFilterComponent,
    VendorDetailAttributeComponent,
    VendorDetailInvoiceComponent,
    LedgerAccountComponent,
    LedgerAccountDetailComponent,
    LedgerFilterComponent,
    LedgerAttributeComponent,
    LedgerAccountDistributionComponent,
    ApprovalCriteriaComponent,
    ApprovalsViewComponent,
    ApprovalFilterComponent,
    AchSetupComponent,
    AchSetupFilterBarComponent,
    AchSetupAttributeComponent,
    AchSetupDetailComponent,
    InvoiceComponent,
    InvoiceFilterComponent,
    InvoiceDetailComponent,
    InvoiceDetailFilterComponent,
    InvoiceDetailAttributeComponent,
    InvoiceDetailDistributeComponent,
    InvoiceDetailInvoiceComponent,
    PurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    JobCategoryComponent,
    IniSetupComponent,
    CompanyDropdownComponent,
    VendorDropdownComponent,
    UserDropdownComponent,
    CrumbBarComponent,
    OrderByPipe,
    JobComponent,
    JobDetailComponent,
    JobAttributeComponent,
    AttachmentComponent,
    AptTotalsComponent,
    CompanyRoleComponent,
    CompanyTitleComponent,
    Pagination,
    PagerComponent,
    CompanyPathDropdownComponent,
    SyncTypeDropdownComponent,
    InvoiceCheckDetailComponent,
    VendorFilterComponent,
    InvoiceEntryComponent,
    InvoiceEntryAccountsComponent,
    InvoiceEntryDistributionsComponent,
    InvoiceEntryPurchaseComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Angular2DataTableModule,
    AlertModule,
    DataTableModule,
    DropdownModule,
    SelectModule,
    NgbModule.forRoot()
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    RoleService,
    IniSetupService,
    ApprovalCriteriaService,
    LedgerAccountService,
    DashboardService,
    VendorService,
    InvoiceService,
    AccountService,
    MasterService,
    UserService,
    LocalStorageService,
    AuthService,
    ConfirmService,
    AchSetupService,
    CompanyService,
    AttachmentService,
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend,
        requestOptions: RequestOptions,
        router: Router,
        localStorageService: LocalStorageService) => new HttpInterceptor(xhrBackend,
          requestOptions,
          router,
          localStorageService),

      deps: [XHRBackend, RequestOptions, Router, LocalStorageService],
    },
    {
      provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }








