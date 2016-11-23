import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { routing } from './app.routing';
import { Angular2DataTableModule } from 'angular2-data-table';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpInterceptor } from './shared/httpInterceptor';
import { XHRBackend } from '@angular/http';

import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { ConfirmService } from './shared/services/otherServices/confirmService';
/* bootstrap components start */
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
/* bootstrap components end */


/*sp-app services*/

import { MasterService } from './shared/services/master/master.service';
import { UserService } from './user/shared/user.service';
import { AuthService } from './shared/services/otherServices/auth.service';
import { CompaniesService } from './companies/shared/companies.service';
import { AccountService } from './account/shared/account.service';
import { VendorService } from './vendor/shared/vendor.service';
import { DashboardService } from './dashboard/shared/dashboard.service';
import { LedgerAccountService } from './ledger-account/shared/ledger-account.service';
import { ApprovalCriteriaService } from './approval-criteria/shared/approval-criteria.service';
import { IniSetupService } from './ini-setup/shared/ini-setup.service';
import { RoleService } from './role/shared/role.service';

/* sp-app components */
import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';

import { CompanyComponent } from './company/company.component';
import { CompanyDetailsComponent } from './companies/companyDetails.component';
import { CompaniesComponent } from './companies/companies.component';

import { VendorComponent } from './vendor/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { VendorFilterComponent } from './vendor/vendor-detail/filter-bar.component';
import { VendorAttributeComponent } from './vendor/vendor-detail/attribute.component';
import { VendorInvoiceComponent } from './vendor/vendor-detail/invoice.component';


import { LedgerAccountComponent } from './ledger-account/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail/ledger-account-detail.component';
import { LedgerFilterComponent } from './ledger-account/ledger-account-detail/filter-bar.component';
import { LedgerAttributeComponent } from './ledger-account/ledger-account-detail/attribute.component';
import { LedgerAccountDistributionComponent } from './ledger-account/ledger-account-detail/account-distribution.component';


import { IniSetupComponent } from './ini-setup/ini-setup.component';

import { JobsComponent } from './jobs/jobs.component';
import { JobDetailsComponent } from './jobs/jobDetails.component';
import { JobCategoryComponent } from './jobs/jobCategories.component';

import { ApprovalCriteriaComponent } from './approval-criteria/approval-criteria.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';

import { CompanyDropdownComponent } from './shared/dropdown/company/company-dropdown.component';


let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'localStorage'
};


@NgModule({
    declarations: [
        AppComponent,
        OtherComponent,
        LoginComponent,
        CompanyComponent,
        CompaniesComponent,
        VendorComponent,
        VendorDetailComponent,
        VendorFilterComponent,
        VendorInvoiceComponent,
        VendorAttributeComponent,
        JobsComponent,
        LedgerAccountComponent,
        LedgerAccountDetailComponent,
        LedgerFilterComponent,
        LedgerAttributeComponent,
        LedgerAccountDistributionComponent,
        ApprovalCriteriaComponent,
        PurchaseOrderComponent,
        CompanyDetailsComponent,
        JobDetailsComponent,
        JobCategoryComponent,
        IniSetupComponent,
        CompanyDropdownComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        Angular2DataTableModule,
        AlertModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        RoleService,
        IniSetupService,
        ApprovalCriteriaService,
        LedgerAccountService,
        DashboardService,
        VendorService,
        AccountService,
        CompaniesService,
        MasterService,
        UserService,
        LocalStorageService,
        AuthService,
        ConfirmService,
        {
            provide: Http,
            useFactory: (xhrBackend: XHRBackend,
                requestOptions: RequestOptions,
                router: Router,
                localStorageService: LocalStorageService) => new HttpInterceptor(xhrBackend,
                    requestOptions,
                    router,
                    localStorageService),

            deps: [XHRBackend, RequestOptions, Router, LocalStorageService],
        },
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }








