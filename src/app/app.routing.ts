import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { AccountComponent } from './account/account.component';

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
import { InvoiceEntryComponent } from './invoice/invoice-entry/invoice-entry.component';

import { AttachmentComponent } from './attachment/attachment.component';

import { RoleComponent } from './role/role-dashboard/role.component';
import { RoleViewComponent } from './role/role-view/role-view.component';
import { RoleEntryComponent } from './role/role-entry/role-entry.component';

import { SyncBatchComponent } from './sync-batch/sync-batch-dashboard/sync-batch.component';
import { SyncBatchDetailComponent } from './sync-batch/sync-batch-detail/sync-batch-detail.component';
import { SyncBatchEntryComponent } from './sync-batch/sync-batch-entry/sync-batch-entry.component';

import { UserComponent } from './user/user-dashboard/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserEntryComponent } from './user/user-entry/user-entry.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const APP_ROUTES: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },


  { path: 'account/:id', component: AccountComponent },

  { path: 'company/:pageSizeFilter/:searchParameters', component: CompanyComponent },
  { path: 'company/detail/:id/:pageSizeFilter/:searchParameters', component: CompanyDetailComponent },

  { path: 'job/:pageSizeFilter', component: JobComponent },
  { path: 'job/detail/:id', component: JobDetailComponent },

  { path: 'vendor/:pageSizeFilter/:searchParameters', component: VendorComponent },
  { path: 'vendor/:companyId', component: VendorComponent },
  { path: 'vendor/detail/:id/:pageSizeFilter/:searchParameters', component: VendorDetailComponent },

  { path: 'ledgerAccount/:pageSizeFilter/:searchParameters', component: LedgerAccountComponent },
  { path: 'ledgerAccount/detail/:id/:pageSizeFilter/:searchParameters', component: LedgerAccountDetailComponent },

  { path: 'achSetup/:id/:pageSizeFilter', component: AchSetupComponent },
  { path: 'achSetup/detail/:id/:pageSizeFilter', component: AchSetupDetailComponent },

  { path: 'invoice/:pageSizeFilter/:searchParameters', component: InvoiceComponent },
  { path: 'invoices/:id/:pageSizeFilter/:searchParameters', component: InvoiceDetailComponent },

  { path: 'purchaseOrder/:pageSizeFilter/:searchParameters', component: PurchaseOrderComponent },
  { path: 'purchaseOrderDetail/:id', component: PurchaseOrderDetailComponent },

  { path: 'iniSetup', component: IniSetupComponent },

  { path: 'approval/:id', component: ApprovalCriteriaComponent },

  // { path: 'attachment', component: AttachmentComponent },
  { path: 'attachmentsList/:pageSizeFilter/:SearchParameters', component: AttachmentComponent },
  { path: 'invoices/:pageSizeFilter/:SearchParameters/:InvoiceID/new/:attachmentId', component: InvoiceEntryComponent },

  { path: 'syncBatch/:pageSizeFilter/:searchParameters', component: SyncBatchComponent },
  { path: 'syncBatch/detail/:id/:pageSizeFilter/:searchParameters', component: SyncBatchDetailComponent },
  { path: 'syncBatchNew/:searchParameters', component: SyncBatchEntryComponent },

  { path: 'role/:pageSizeFilter/:searchParameters', component: RoleComponent },
  { path: 'role/view/:id/:pageSizeFilter', component: RoleViewComponent },
  { path: 'role/entry/:id/:pageSizeFilter/:searchParameters', component: RoleEntryComponent },

  { path: 'user/:pageSizeFilter/:searchParameters', component: UserComponent },
  { path: 'user/detail/:id/:pageSizeFilter', component: UserDetailComponent },
  { path: 'userEntry/:id', component: UserEntryComponent },
  { path: 'dashboard', component: DashboardViewComponent },


  // routing for reset password
  { path: 'resetPassword', component: ResetPasswordComponent },

];

export const routing = RouterModule.forRoot(APP_ROUTES);
