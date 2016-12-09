import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
import { PurchaseOrderModel } from './purchase-order.model';
@Injectable()
export class PurchaseOrderSevice {
  constructor(private http: Http) {

  }
  public getPurchaseOrders(companyId: number, pageNumber: number, rowsPerPage: number) {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/purchaseorders/all/'
      + companyId
      + '/'
      + pageNumber
      + '/'
      + rowsPerPage
      )
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }


  public getPurchaseOrderById(purchaseOrderId: number, currentPage: number, pageSize: number) {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/purchaseorders/'
      + purchaseOrderId
      + '/'
      + currentPage
      + '/'
      + pageSize
      )
      .toPromise()
      .then(response => response.json())
      .catch(error => error);

  }

  public handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }



}
