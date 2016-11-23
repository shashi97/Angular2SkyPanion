import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class IniSetupService {

    constructor(private http: Http) {

    }

    // getVendorDetail(vendorId, companyId, pageNumber, rowsPerPage): Promise<VendorDetail> {
    //     return this.http.get(ApiUrl.baseUrl
    //       + "api/vendor/detail/"
    //       + vendorId
    //       + "/" + companyId
    //       + "/" + pageNumber
    //       + "/" + rowsPerPage)
    //       .toPromise()
    //       .then(response =>
    //         response.json() as VendorDetail)
    //       .catch(this.handleError);
    //   }    
    getIniSetupDetails = function () {
        return this.http.get(ApiUrl.baseUrl + "api/iniSetup")
            .toPromise()
            .then(response =>
                response.json())
            .catch(this.handleError);
    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}