import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { VendorModel } from './vendor.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class VendorService {

  constructor(private http: Http) {

  }
  public getVendors(ledgerAccountId: number,
    companyId: number,
    vendorName: string,
    vendorKey: string,
    currentPage: number,
    pageSize: number
  ): Promise<VendorModel[]> {

    if (vendorName == '') {
      vendorName = null;
    }
    if (vendorKey == '') {
      vendorKey = null;
    }
    return this
      .http
      .get(ApiUrl.baseUrl +
      'api/vendor/' +
      ledgerAccountId +
      '/' + companyId +
      '/' + vendorName +
      '/' + vendorKey +
      '/' + currentPage +
      '/' + pageSize)
      .toPromise()
      .then(response =>
        response.json() as VendorModel[])
       .catch(error => error);

  }

  getVendorDetail(vendorId, companyId, pageNumber, rowsPerPage): Promise<VendorModel> {
    let getUrl = ApiUrl.baseUrl
      + "api/vendor/detail/"
      + vendorId + "/"
      + companyId + "/"
      + pageNumber + "/"
      + rowsPerPage;

    return this.http
      .get(getUrl)
      .toPromise()
      .then(response =>
        response.json() as VendorModel)
      .catch(error => error);
  }

  getDistinctVendors() {
    return this.http
      .get(ApiUrl.baseUrl + "api/vendor/vendorList")
      .toPromise()
      .then(response =>
        response.json() as VendorModel)
      .catch(error => error);
  }



  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}