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
  checkInvoiceNumberExists(param) {
    var data = JSON.stringify(param);
    return this.http.post(ApiUrl.baseUrl + "api/invoices/PostSearchToInvoiceNumberExists/", data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
    
  }
   removeInvoiceDistributions(distID, invoiceID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/removeDist/" + distID + "/" + invoiceID)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }
 getNextAttachmentIDs(attachmentID:number): Promise<any> {
    
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/invoices/nextAttachments/'+ attachmentID)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
   saveInvoice(invoiceDetail){
      var data = JSON.stringify(invoiceDetail);
    return this
      .http
      .post(ApiUrl.baseUrl + "api/invoices/newOrUpdate", data)
      .toPromise()
      .then(response => response.json())
        .catch(error => error);
  }

  deleteInvoice(invoiceID){
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getInvoiceDelete/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

   submitInvoicebatch(invoiceID){
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getInvoicebatch/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

 submitInvoiceExpedite(invoiceID){
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getInvoiceExpedite/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

   submitInvoiceForApproval(invoiceID){
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/InvoiceForApproval/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}