import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailsComponent } from './companies/companyDetails.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';
import { LedgerAccountComponent } from './ledger-account/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail.component';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-criteria.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailsComponent } from './jobs/jobDetails.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'companies', component: CompaniesComponent },
    { path: 'companyDetail/:SearchParameters/:companyId', component: CompanyDetailsComponent },
    { path: 'jobs', component: JobsComponent },
    { path: 'jobDetail/:jobId', component: JobDetailsComponent },
    { path: 'vendor', component: VendorComponent },
    { path: 'vendor/:searchParameters', component: VendorComponent },
    { path: 'vendorDetail/:vendorId', component: VendorDetailComponent },
    { path: 'ledgerAccount', component: LedgerAccountComponent },
    { path: 'ledgerAccount/:searchParameters', component: LedgerAccountComponent },
    { path: 'ledgerAccountDetail/:id', component: LedgerAccountDetailComponent },
    { path: 'approvals', component: ApprovalCriteriaComponent },
    { path: 'client', component: PurchaseOrderComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
