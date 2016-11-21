import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailComponent } from './company/companyDetail.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail.component';
import { JobComponent } from './job/job.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';
import { LedgerAccountComponent } from './ledger-account/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail.component';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-criteria.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'company/:searchParameters/:companyID', component: CompanyDetailComponent },
    { path: 'companies', component: CompaniesComponent },
    { path: 'vendor', component: VendorComponent },
    { path: 'vendor/:searchParameters', component: VendorComponent },
    { path: 'vendorDetail/:vendorId', component: VendorDetailComponent },
    { path: 'ledgerAccount', component: LedgerAccountComponent },
    { path: 'ledgerAccount/:searchParameters', component: LedgerAccountComponent },
    { path: 'ledgerAccountDetail/:id', component: LedgerAccountDetailComponent },
    { path: 'approvals', component: ApprovalCriteriaComponent },
    { path: 'job', component: JobComponent },
    { path: 'purchaseOrder', component: PurchaseOrderComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
