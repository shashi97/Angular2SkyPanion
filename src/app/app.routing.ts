import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './companies/company-dashboard/company.component';
import { CompanyDetailComponent } from './companies/company-detail/company-detail.component';
import { VendorComponent } from './vendor/vendor-dashboard/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order-dashboard/purchase-order.component';
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

import { AttachmentComponent } from './attachment/attachment.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'company', component: CompanyComponent },
  { path: 'company/:searchParameters' , component: CompanyComponent  },
  { path: 'companyDetail/:companyId', component: CompanyDetailComponent },
  { path: 'companyDetail/:SearchParameters/:companyId', component: CompanyDetailComponent },

  { path: 'job', component: JobComponent },
  { path: 'job/:jobId', component: JobDetailComponent },

  { path: 'vendor', component: VendorComponent },
  { path: 'vendor/:searchParameters', component: VendorComponent },
  { path: 'vendor/vendorDetail/:vendorId', component: VendorDetailComponent },
  {path:  'company/:companyId/ledgeraccounts/led', component: LedgerAccountComponent},
  { path: 'ledgerAccount', component: LedgerAccountComponent },
  { path: 'ledgerAccount/:searchParameters', component: LedgerAccountComponent },
  { path: 'ledgerAccount/ledgerAccountDetail/:id', component: LedgerAccountDetailComponent },

  { path: 'achSetups', component: AchSetupComponent },
  { path: 'achSetups/achSetupDetail/:id', component: AchSetupDetailComponent },
  { path: 'achSetups/:companyId/achsetups', component: AchSetupDetailComponent },


  { path: 'invoices', component: InvoiceComponent },
  { path: 'invoices/:SearchParameters', component: InvoiceComponent },
  { path: 'invoices/invoiceDetail/:invoiceId', component: InvoiceDetailComponent },

  { path: 'purchaseOrder', component: PurchaseOrderComponent },
  { path: 'iniSetup', component: IniSetupComponent },
  { path: 'approvals', component: ApprovalCriteriaComponent },
  { path: 'approvals/:companyId', component: ApprovalCriteriaComponent },

  { path: 'attachments', component: AttachmentComponent },
  { path: 'attachments/:SearchParameters', component: AttachmentComponent },
  { path: 'syncbatcheNew', component: SyncBatchEntryComponent }

];

export const routing = RouterModule.forRoot(APP_ROUTES);
