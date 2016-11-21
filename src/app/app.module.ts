import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { Angular2DataTableModule } from 'angular2-data-table';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpInterceptor } from './shared/httpInterceptor';
import { XHRBackend } from '@angular/http';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
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

/* sp-app components */
import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailComponent } from './company/companyDetail.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDetailComponent } from './vendor/vendor-detail.component';
import { LedgerAccountComponent } from './ledger-account/ledger-account.component';
import { LedgerAccountDetailComponent } from './ledger-account/ledger-account-detail.component';
import { ApprovalCriteriaComponent } from './approval-criteria/approval-criteria.component';
import { JobComponent } from './job/job.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';


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
    LedgerAccountComponent,
    LedgerAccountDetailComponent,
    ApprovalCriteriaComponent,
    JobComponent,
    PurchaseOrderComponent,
    CompanyDetailComponent

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
