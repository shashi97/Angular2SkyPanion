import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailsComponent } from './companies/companyDetails.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorComponent } from './vendor/vendor.component';
import { JobsComponent } from './jobs/jobs.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';
import { JobDetailsComponent } from './jobs/jobDetails.component';

const APP_ROUTES: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'company', component: CompanyComponent },
{ path: 'companyDetails/:searchParameters/:companyId', component: CompanyDetailsComponent },
{ path: 'companies', component: CompaniesComponent },
{ path: 'vendor', component: VendorComponent },
{ path: 'jobs', component: JobsComponent },
{ path: 'jobDetails/:jobId', component: JobDetailsComponent },
{ path: 'purchaseOrder', component: PurchaseOrderComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);
