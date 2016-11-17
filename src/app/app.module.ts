import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { Angular2DataTableModule } from 'angular2-data-table';
/* bootstrap components start */

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

/* bootstrap components end */


/* sky-app components start */
import { MasterService } from './shared/services/master.service';
import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { CompanyDetailComponent } from './company/companyDetail.component';
import { CompaniesComponent } from './companies/companies.component';
import { VendorComponent } from './vendor/vendor.component';
import { JobComponent } from './job/job.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';
/* sky-app components end */

/* sky-app service start*/
//  import { CompaniesService } from "./companies/shared/companies.service";

/* sky-app service end*/

@NgModule({
  declarations: [
    AppComponent,
    OtherComponent,
    LoginComponent,
    CompanyComponent,
    CompanyDetailComponent,
    CompaniesComponent,
    VendorComponent,
    JobComponent,
    PurchaseOrderComponent

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
    MasterService
    // CompaniesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
