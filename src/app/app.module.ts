import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from "./app.routing";
import { Angular2DataTableModule } from 'angular2-data-table';


import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpInterceptor } from './shared/httpInterceptor';
import { XHRBackend } from '@angular/http';



import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
/* bootstrap components start */

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

/* bootstrap components end */


/* sky-app components start */
import { MasterService } from "./shared/services/master/master.service";
import { UserService } from "./shared/services/user/user.service";
import { AuthService } from "./shared/services/otherServices/auth.service";
import { AppComponent } from './app.component';
import { OtherComponent } from './other/other.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from "./company/company.component";
import { CompanyDetailComponent } from "./company/companyDetail.component";

/* sky-app components end */

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
