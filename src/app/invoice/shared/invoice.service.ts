import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { InvoiceModel } from './invoice.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class InvoiceService {

  constructor(private http: Http) {
  }


  getInvoices(searchFields) {
    var data = JSON.stringify(searchFields);
    return this.http
      .post(ApiUrl.baseUrl + "api/invoices/PostSearchTogetInvoices", data)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }


  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}