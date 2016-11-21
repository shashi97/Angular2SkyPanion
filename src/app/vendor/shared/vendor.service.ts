import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { VendorRow, VendorDetail } from './vendor.model';
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
  ): Promise<VendorRow[]> {
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
        response.json() as VendorRow[])
      .catch(this.handleError);

  }

  getVendorDetail(vendorId, companyId, pageNumber, rowsPerPage): Promise<VendorDetail> {
    return this.http.get(ApiUrl.baseUrl
      + "api/vendor/detail/"
      + vendorId
      + "/" + companyId
      + "/" + pageNumber
      + "/" + rowsPerPage)
      .toPromise()
      .then(response =>
        response.json() as VendorDetail)
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}