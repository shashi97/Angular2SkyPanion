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
import { CustomModal } from './account/custom-modal';

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
  { path: 'achSetups/:id/achsetups', component: AchSetupDetailComponent },

  { path: 'invoices', component: InvoiceComponent },
  { path: 'invoices/:SearchParameters', component: InvoiceComponent },
  { path: 'invoices/invoiceDetail/:invoiceId', component: InvoiceDetailComponent },

  { path: 'purchaseOrder', component: PurchaseOrderComponent },
  { path: 'purchaseOrder/:purchaseOrderId', component: PurchaseOrderDetailComponent },
  { path: 'iniSetup', component: IniSetupComponent },
  { path: 'approvals', component: ApprovalCriteriaComponent },
  { path: 'approvals/:companyId', component: ApprovalCriteriaComponent },
  { path: 'attachments', component: AttachmentComponent },
  { path: 'attachments/:SearchParameters', component: AttachmentComponent },
  { path: 'syncbatcheNew', component: SyncBatchEntryComponent },
  { path: 'syncbatcheNew/:SearchParameters/:SyncBatcheID/new', component: SyncBatchEntryComponent },
  { path: 'attachments', component: AttachmentComponent },
  { path: 'attachments/invoicesNew', component: InvoiceEntryComponent },
  { path: 'modal', component: CustomModal},
  { path: 'role', component: RoleComponent},
  { path: 'role/:SearchParameters', component: RoleComponent},
  { path: 'roles/:SearchParameters/:RoleId', component: RoleViewComponent},
  { path: 'roles/:SearchParameters/:roleId/edit', component: RoleEntryComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
