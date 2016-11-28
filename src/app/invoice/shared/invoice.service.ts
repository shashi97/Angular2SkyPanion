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
    searchFields = {
      companyID: 0,
      currentPage: 1,
      invFromDate: "",
      invToDate: "",
      invoiceDesc: "",
      invoiceNumber: "",
      pageSize: 25,
      statusID: -1,
      userID: -1,
      vendorID: 0
    }

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


  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}