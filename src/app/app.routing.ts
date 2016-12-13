import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './companies/company-dashboard/company.component';
import { CompanyDetailComponent } from './companies/company-detail/company-detail.component';
import { VendorComponent } from './vendor/vendor-dashboard/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order-dashboard/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';

import { LedgerAccountComponent } from './ledger-account/ledger-dashboard/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail/ledger-account-detail.component';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-dashboard/approval-criteria.component';
import { JobComponent } from './job/job-dashboard/job.component';
import { JobDetailComponent } from './job/job-detail/job-detail.component';
import { IniSetupComponent } from './ini-setup/ini-setup.component';
import { AchSetupComponent } from './ach-setups/ach-setup-dashboard/ach-setup.component';
import { AchSetupDetailComponent } from './ach-setups/ach-setup-detail/ach-setup-detail.component';
import { InvoiceComponent } from './invoice/invoice-dashboard/invoice.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { SyncBatchEntryComponent } from './sync-batch/sync-batch-entry/sync-batch-entry.component';
import { InvoiceEntryComponent } from './invoice/invoice-entry/invoice-entry.component';
import { AttachmentComponent } from './attachment/attachment.component';

import { RoleComponent } from './role/role-dashboard/role.component';
import { RoleViewComponent } from './role/role-view/role-view.component';
import { RoleEntryComponent } from './role/role-entry/role-entry.component';


import { SyncBatchComponent } from './sync-batch/sync-batch-dashboard/sync-batch.component';
import { SyncBatchDetailComponent } from './sync-batch/sync-batch-detail/sync-batch-detail.component';

import { UserComponent } from './user/user-dashboard/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserEntryComponent } from './user/user-entry/user-entry.component';


const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'company/:pageSizeFilter/:searchParameters', component: CompanyComponent },
  { path: 'companyDetail/:pageSizeFilter/:searchParameters/:companyId', component: CompanyDetailComponent },
  { path: 'companyDetail/:companyId', component: CompanyDetailComponent },

  { path: 'job/:pageSizeFilter', component: JobComponent },
  { path: 'jobDetail/:jobId', component: JobDetailComponent },

  { path: 'vendor/:pageSizeFilter/:searchParameters', component: VendorComponent },
  { path: 'companyVendors/:companyId/vendor', component: VendorComponent },
  { path: 'vendorDetail/:pageSizeFilter/:searchParameters/:vendorId', component: VendorDetailComponent },
  { path: 'vendorDetail/:vendorId', component: VendorDetailComponent },

  { path: 'ledgerAccount/:pageSizeFilter/:searchParameters', component: LedgerAccountComponent },
  { path: 'ledgerAccountDetail/:pageSizeFilter/:searchParameters/:id', component: LedgerAccountDetailComponent },


  { path: 'achSetups/:pageSizeFilter/:companyId', component: AchSetupComponent },
  { path: 'achSetupDetail/:pageSizeFilter/:id', component: AchSetupDetailComponent },

  { path: 'invoices/:pageSizeFilter/:searchParameters', component: InvoiceComponent },
  { path: 'invoiceDetail/:pageSizeFilter/:searchParameters/:invoiceId', component: InvoiceDetailComponent },

  { path: 'purchaseOrder/:pageSizeFilter/:searchParameters', component: PurchaseOrderComponent },
  { path: 'purchaseOrderDetail/:purchaseOrderId', component: PurchaseOrderDetailComponent },

  { path: 'iniSetup', component: IniSetupComponent },


  // { path: 'approvals', component: ApprovalCriteriaComponent },

  { path: 'approvals/:companyId', component: ApprovalCriteriaComponent },



  { path: 'attachments', component: AttachmentComponent },
  { path: 'attachments/:SearchParameters', component: AttachmentComponent },

  { path: 'attachments/invoicesNew/:AttachmentID', component: InvoiceEntryComponent },


  { path: 'syncBatches/:pageSizeFilter/:searchParameters', component: SyncBatchComponent },
  { path: 'syncBatchDetail/:syncBatchId', component: SyncBatchDetailComponent },
  { path: 'syncBatcheNew', component: SyncBatchEntryComponent },
  { path: 'syncBatcheNew/:searchParameters', component: SyncBatchEntryComponent },

  // { path: 'modal', component: CustomModal },


  { path: 'role/:pageSizeFilter/:searchParameters', component: RoleComponent },
  { path: 'roles/:searchParameters/:roleId', component: RoleViewComponent },
  { path: 'roles/:searchParameters/:roleId/edit', component: RoleEntryComponent },
  { path: 'rolesAdd/:roleId/new', component: RoleEntryComponent },

  { path: 'users/:pageSizeFilter/:searchParameters', component: UserComponent },
  { path: 'userDetail/:pageSizeFilter/:userId', component: UserDetailComponent },
  { path: 'userEntry/:userId', component: UserEntryComponent }

];

export const routing = RouterModule.forRoot(APP_ROUTES);
