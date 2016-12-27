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
import { ModalModule, DialogRef } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { PaginationComponent } from './pagination/pagination.component';

import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { ConfirmService } from './shared/services/otherServices/confirmService';

import { DropdownModule, MultiSelectModule } from 'primeng/primeng';

/* for pagination */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* for tooltip */
import { TooltipModule } from 'ng2-tooltip';

import {ToastModule} from 'ng2-toastr/ng2-toastr';

/* for drag and drop grid rows */
import { DragulaModule } from 'ng2-dragula/ng2-dragula';



/* bootstrap components start */
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { UiSwitchModule } from 'angular2-ui-switch';
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
import { ApprovalModalComponent } from './approval-criteria/approval-dashboard/approval-criteria.modal';
import { IniSetupService } from './ini-setup/shared/ini-setup.service';
import { RoleService } from './role/shared/role.service';
import { AchSetupService } from './ach-setups/shared/ach-setup.service';
import { InvoiceService } from './invoice/shared/invoice.service';
import { AttachmentService } from './attachment/shared/attachment.service';

import { SyncBatchService } from './sync-batch/shared/sync-batch.service';

import { InvoiceEntryService } from './invoice/invoice-entry/shared/invoice-entry.service';

/*pipes */
import { OrderByPipe, FilterPipe } from './shared/pipe/orderby';
import {  Modal } from 'angular2-modal';

import { ModalComponent, CloseGuard } from 'angular2-modal';
/* sp-app components */

import { UserComponent } from './user/user-dashboard/user.component';
import { UserFilterComponent } from './user/user-dashboard/filter-bar.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserDetailAttributeComponent } from './user/user-detail/attribute.component';
import { UserDetailFilterComponent } from './user/user-detail/filter-bar.component';
import { UserEntryComponent } from './user/user-entry/user-entry.component';
import { UserEntryFilterComponent } from './user/user-entry/filter-bar.component';


import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';

import { AccountComponent } from './account/account.component';

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
import { LedgerAccountFilterComponent } from './ledger-account/ledger-dashboard/filter-bar.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail/ledger-account-detail.component';
import { LedgerFilterComponent } from './ledger-account/ledger-account-detail/filter-bar.component';
import { LedgerAttributeComponent } from './ledger-account/ledger-account-detail/attribute.component';
import { LedgerAccountDistributionComponent } from './ledger-account/ledger-account-detail/account-distribution.component';


import { IniSetupComponent } from './ini-setup/ini-setup.component';
import { ShowOnRowHover } from './shared/directive/showOnRowHover';

import { JobComponent } from './job/job-dashboard/job.component';
import { JobDetailComponent } from './job/job-detail/job-detail.component';
import { JobAttributeComponent } from './job/job-detail/attribute.component';
import { JobCategoryComponent } from './job/job-detail/category.component';
import { JobsService } from './job/shared//jobs.service';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-dashboard/approval-criteria.component';
import { ApprovalsViewComponent } from './approval-criteria/approval-dashboard/approvals-view.component';
import { ApprovalFilterComponent } from './approval-criteria/approval-dashboard/filter-bar.component';


import { PurchaseOrderComponent } from './purchase-order/purchase-order-dashboard/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderAttributeComponent } from './purchase-order/purchase-order-detail/attribute.component';
import { PurchaseOrderInvoicesComponent } from './purchase-order/purchase-order-detail/invoices.component';
import { PurchaseOrderFilterComponent } from './purchase-order/purchase-order-dashboard/filter-bar.component';

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
import { InvoiceEntryVendorComponent } from './invoice/invoice-entry-components/vendors-model/invoice-entry-vendor.component';
import { InvoicePdfRejectModalComponent } from './invoice/invoice-entry-components/invalid-remove-invoice/invalid-remove-invoice.component';
import { InvoiceEntryNoApproverExistsComponent } from './invoice/invoice-entry-components/noApproverExists-model/invoice-entry-noApproverExists.component';
import {InvoiceApprovalModalComponent } from './dashboard/invoice-modals/invoice-approval-modal/invoice-approval.component';
import {InvoiceDistributionCommentModalComponent } from
                       './dashboard/invoice-modals/invoice-distribution-comment-model/invoice-distribution-comment.component';

import { AttachmentComponent } from './attachment/attachment.component';


import { SyncBatchComponent } from './sync-batch/sync-batch-dashboard/sync-batch.component';
import { SyncBatchFilterComponent } from './sync-batch/sync-batch-dashboard/filter-bar.component';
import { SyncBatchDetailComponent } from './sync-batch/sync-batch-detail/sync-batch-detail.component';
import { SyncBatchDetailFilterComponent } from './sync-batch/sync-batch-detail/filter-bar.component';
import { SyncBatchDetailAttributeComponent } from './sync-batch/sync-batch-detail/attribute.component';
import { SyncBatchDetailInvoiceComponent } from './sync-batch/sync-batch-detail/invoices.component';

import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DashboardStateFilterComponent } from './dashboard/dashboard-view/dashboard-state-filter.component';
import { DashboardInvoicesComponent } from './dashboard/dashboard-view/dashboard-invoices.component';

import { InvoiceEntryComponent } from './invoice/invoice-entry/invoice-entry.component';

import { InvoiceEntryAccountsComponent }
from './invoice/invoice-entry-components/accounts-model/invoice-entry-accounts.component';

import { InvoiceEntryDistributionsComponent }
from './invoice/invoice-entry-components/distributions-model/invoice-entry-distributions.component';
import { AttachmentEditComponent } from './attachment/attachment-edit-model/attachment-edit-model.component';

import { InvoiceEntryPurchaseComponent } from './invoice/invoice-entry-components/purchase-model/invoice-entry-purchase.component';



/* for sync batch entry */
import { SyncBatchEntryComponent } from './sync-batch/sync-batch-entry/sync-batch-entry.component';
import { ReleaseInvoiceComponent } from './sync-batch/sync-batch-entry/release-invoices.Component';
import { WaitingInvoiceComponent } from './sync-batch/sync-batch-entry/waiting-invoices.component';
import { FilterInvoiceComponent } from './sync-batch/sync-batch-entry/filter-invoice.component';

/* for role entry */
import { RoleComponent } from './role/role-dashboard/role.component';

import {  SetupModalComponent } from './ini-setup/setup-modal.component';
import { RoleViewComponent } from './role/role-view/role-view.component';
import { RoleMemberComponent } from './role/role-view/role-member.component';
import { RoleAttributeComponent } from './role/role-view/role-attribute.component';
import { RoleEntryComponent } from './role/role-entry/role-entry.component';
import { RoleFilterComponent } from './role/role-dashboard/filter-bar.component';
import { SyncModelComponent } from './sync-batch/sync-batch-entry/sync-modal.component';

/* for Reset Password */
import { ResetPasswordService } from './reset-password/shared/reset-password.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

let localStorageServiceConfig = {
  prefix: 'my-app',
  storageType: 'localStorage'
};

@NgModule({

  declarations: [
    OrderByPipe,
    AppComponent,
    OtherComponent,
    LoginComponent,
    AccountComponent,
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
    LedgerAccountFilterComponent,
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
    PurchaseOrderAttributeComponent,
    PurchaseOrderInvoicesComponent,
    PurchaseOrderFilterComponent,
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
    PagerComponent,
    CompanyPathDropdownComponent,
    SyncTypeDropdownComponent,
    SyncBatchDetailComponent,
    SyncBatchFilterComponent,
    SyncBatchComponent,
    SyncBatchDetailFilterComponent,
    SyncBatchDetailAttributeComponent,
    SyncBatchDetailInvoiceComponent,
    InvoiceCheckDetailComponent,
    VendorFilterComponent,
    SyncBatchEntryComponent,
    UserFilterComponent,
    UserComponent,
    UserDetailComponent,
    UserDetailAttributeComponent,
    UserDetailFilterComponent,
    UserEntryComponent,
    UserEntryFilterComponent,
    InvoiceEntryComponent,
    InvoiceEntryAccountsComponent,
    InvoiceEntryDistributionsComponent,
    InvoiceEntryPurchaseComponent,
    ReleaseInvoiceComponent,
    WaitingInvoiceComponent,
    FilterInvoiceComponent,
    RoleComponent,
    RoleViewComponent,
    RoleMemberComponent,
    RoleAttributeComponent,
    RoleEntryComponent,
    RoleFilterComponent,
    SetupModalComponent,
    SyncModelComponent,

    InvoiceEntryVendorComponent,
    DashboardViewComponent,
    DashboardStateFilterComponent,
    DashboardInvoicesComponent,
    FilterPipe,
    ApprovalModalComponent,
    // InvoiceRejectModalComponent,
    InvoiceApprovalModalComponent,
    InvoiceDistributionCommentModalComponent,
    InvoiceEntryNoApproverExistsComponent,
    ShowOnRowHover,
    AttachmentEditComponent,
    ResetPasswordComponent,
    InvoicePdfRejectModalComponent
  ],
  entryComponents: [
    SetupModalComponent,
    ApprovalModalComponent,
    SyncModelComponent,
    InvoiceEntryPurchaseComponent,
    InvoiceEntryVendorComponent,
    InvoiceEntryAccountsComponent,
    // InvoiceRejectModalComponent,
    InvoiceApprovalModalComponent,
    InvoiceDistributionCommentModalComponent,
    AttachmentEditComponent,
    InvoiceEntryNoApproverExistsComponent,
    InvoicePdfRejectModalComponent


  ],
  imports: [
    UiSwitchModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DragulaModule,
    Angular2DataTableModule,
    AlertModule,
    DataTableModule,
    DropdownModule,
    MultiSelectModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,
    TooltipModule,
    ToastModule
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
    InvoiceEntryService,
    JobsService,
    SyncBatchService,
    ResetPasswordService,
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








