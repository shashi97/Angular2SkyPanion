import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailComponent } from './company/companyDetail.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorComponent } from './vendor/vendor.component';
import { JobComponent } from './job/job.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';

const APP_ROUTES: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'company', component: CompanyComponent },
{ path: 'company/:searchParameters/:companyID', component: CompanyDetailComponent },
{ path: 'companies', component: CompaniesComponent },
{ path: 'vendor', component: VendorComponent },
{ path: 'job', component: JobComponent },
{ path: 'purchaseOrder', component: PurchaseOrderComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES);
