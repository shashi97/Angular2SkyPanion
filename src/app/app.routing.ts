import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailsComponent } from './companies/companyDetails.component';
import { VendorComponent } from './vendor/vendor-dashboard/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order-dashboard/purchase-order.component';
import { LedgerAccountComponent } from './ledger-account/ledger-dashboard/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail/ledger-account-detail.component';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-dashboard/approval-criteria.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailsComponent } from './jobs/jobDetails.component';
import { IniSetupComponent } from './ini-setup/ini-setup.component';
import { AchSetupComponent } from './ach-setups/ach-setup-dashboard/ach-setup.component';
import { AchSetupDetailComponent } from './ach-setups/ach-setup-detail/ach-setup-detail.component';
import { InvoiceComponent } from './invoice/invoice-dashboard/invoice.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'company', component: CompanyComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companyDetail/:SearchParameters/:companyId', component: CompanyDetailsComponent },

  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/jobDetail/:jobId', component: JobDetailsComponent },

  { path: 'vendor', component: VendorComponent },
  { path: 'vendor/:searchParameters', component: VendorComponent },
  { path: 'vendor/vendorDetail/:vendorId', component: VendorDetailComponent },

  { path: 'ledgerAccount', component: LedgerAccountComponent },
  { path: 'ledgerAccount/:searchParameters', component: LedgerAccountComponent },
  { path: 'ledgerAccount/ledgerAccountDetail/:id', component: LedgerAccountDetailComponent },
  
  { path: 'achSetups', component: AchSetupComponent },
  { path: 'achSetups/achSetupDetail/:id', component: AchSetupDetailComponent },

  { path: 'invoices', component: InvoiceComponent },
  { path: 'invoices/invoiceDetail/:id', component: InvoiceDetailComponent },
  
  { path: 'purchaseOrder', component: PurchaseOrderComponent },
  { path: 'iniSetup', component: IniSetupComponent },
  { path: 'approvals', component: ApprovalCriteriaComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
