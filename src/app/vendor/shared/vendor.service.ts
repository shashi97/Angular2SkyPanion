import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { VendorInfo } from './vendor.model';
@Injectable()

export class VendorService {
   private apiServiceBase= 'http://192.168.1.60:5009/';
    constructor(private http: Http) {

    }
    public getVendors(ledgerAccountId: number,
     companyId: number,
     vendorName: string,
     vendorKey: string,
     currentPage: number,
     pageSize: number
       ): Promise<VendorInfo[]> {
            return this
            .http
            .get(this.apiServiceBase +
             'api/vendor/detail/' +
              ledgerAccountId +
              '/' + companyId +
              '/' + vendorName +
              '/' + vendorKey +
              '/' + currentPage +
              '/' + pageSize)
            .toPromise()
            .then(response => response.json() as VendorInfo[])
            .catch(this.handleError);

        }

    public handleError(error: any): Promise<any> {
           console.error('An error occurred', error);
           return Promise.reject(error.message || error);
  }

}