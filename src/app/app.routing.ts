import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { CompanyComponent } from "./company/company.component";
import { CompanyDetailComponent } from "./company/companyDetail.component";
	


const APP_ROUTES: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'company', component: CompanyComponent },
	{ path: 'company/:searchParameters/:companyID', component: CompanyDetailComponent }
   
];

export const routing = RouterModule.forRoot(APP_ROUTES);
