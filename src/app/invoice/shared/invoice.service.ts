import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import 'Rxjs/Rx';
import { InvoiceModel } from './invoice.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class InvoiceService {

  constructor(private http: Http) {
  }


  getInvoices(searchFields) {
    searchFields.statusId = searchFields.statusId == 0 ? -1 : searchFields.statusId;
    searchFields.userId = searchFields.userId == 0 ? -1 : searchFields.userId;
    var data = JSON.stringify(searchFields);
    return this.http
      .post(ApiUrl.baseUrl + "api/invoices/PostSearchTogetInvoices", data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getInvoicesCheckDetailsByInvoiceNumber(invSearchData) {
    var data = JSON.stringify(invSearchData);
    return this.http.post(ApiUrl.baseUrl + "api/invoices/PostInvoicesCheckDetailsByInvoiceNumber/", data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getInvoiceId(invSearchObject) {
    var data = JSON.stringify(invSearchObject);
    return this.http
      .post(ApiUrl.baseUrl + "api/invoices/PostSearchTogetInvoicesIds/", data)
      .toPromise()
      .then(response => response.json() as InvoiceModel)
      .catch(error => error);
  }

  getInvoiceDetail(invoiceId, attachmentId, isFromEditWindow) {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/" + invoiceId + "/" + attachmentId + "/" + isFromEditWindow)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getInvoiceApprovals(invoiceId, InvoiceAmount, CompanyId) {

    let urlString = ApiUrl.baseUrl
      + "api/invoices/approvals/"
      + invoiceId + "/"
      + InvoiceAmount + "/"
      + CompanyId;

    return this.http.get(urlString)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);

  }

  public submitInvoiceExpedite(invoiceID) {
    return this.http.get(ApiUrl.baseUrl
      + "api/invoices/getInvoiceExpedite/" + invoiceID)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }


  public submitInvoiceForApproval(invoiceID) {
    return this.http.get(ApiUrl.baseUrl + "api/invoices/InvoiceForApproval/" + invoiceID)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}