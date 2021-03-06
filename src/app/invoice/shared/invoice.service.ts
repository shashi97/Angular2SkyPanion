import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import 'Rxjs/Rx';
import { InvoiceModel } from './invoice.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class InvoiceService {

  constructor(private http: Http) {
  }

  public getInvoices(searchFields) {
    searchFields.statusId = searchFields.statusId === 0 ? -1 : searchFields.statusId;
    searchFields.userId = searchFields.userId === 0 ? -1 : searchFields.userId;
    let data = JSON.stringify(searchFields);
    return this.http
      .post(ApiUrl.baseUrl + 'api/invoices/PostSearchTogetInvoices', data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getInvoicesCheckDetailsByInvoiceNumber(invSearchData) {
    let data = JSON.stringify(invSearchData);
    return this.http.post(ApiUrl.baseUrl + 'api/invoices/PostInvoicesCheckDetailsByInvoiceNumber/', data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getInvoiceId(invSearchObject):Promise<any> {
    let data = JSON.stringify(invSearchObject);
    return this.http
      .post(ApiUrl.baseUrl + 'api/invoices/PostSearchTogetInvoicesIds/', data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }

  public getInvoiceDetail(invoiceId, attachmentId) {
    return this.http
      .get(ApiUrl.baseUrl + 'api/invoices/' + invoiceId + '/' + attachmentId + '/' + true)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

   public getInvoicesForApprovalByUserID(userID):Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl + 'api/invoices/invoicesForApproval/' + userID )
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }

    public changeInvoiceProperty(attachmentID , invoiceID, companyID, newCompanyNumber, oldCompanyNumber, AttachmentName) {
    return this.http
      .get(ApiUrl.baseUrl + 'api/invoices/getChangeInvoiceProperty/'+attachmentID  + "/" + invoiceID + "/" + companyID + "/" + newCompanyNumber + "/" + oldCompanyNumber + "/" + AttachmentName)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }


  public getInvoiceApprovals(invoiceId, InvoiceAmount, CompanyId) {

    let urlString = ApiUrl.baseUrl
      + 'api/invoices/approvals/'
      + invoiceId + '/'
      + InvoiceAmount + '/'
      + CompanyId;

    return this.http.get(urlString)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);

  }

  public submitInvoiceExpedite(invoiceID) {
    return this.http.get(ApiUrl.baseUrl
      + 'api/invoices/getInvoiceExpedite/' + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }


  public submitInvoiceForApproval(invoiceID) {
    return this.http.get(ApiUrl.baseUrl + 'api/invoices/InvoiceForApproval/' + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }
   public rejectAttachment(attachmentID, rejectionComment) {
    return this.http.get(ApiUrl.baseUrl + "api/invoices/rejectAttachment/" + attachmentID + "/" + rejectionComment)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

  public checkInvoiceNumberExists(param) {
    let data = JSON.stringify(param);
    return this.http.post(ApiUrl.baseUrl + 'api/invoices/PostSearchToInvoiceNumberExists/', data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);

  }

  public removeInvoiceDistributions(distID, invoiceID) {
    return this.http
      .get(ApiUrl.baseUrl + 'api/invoices/removeDist/' + distID + '/' + invoiceID)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getNextAttachmentIDs(attachmentID: number): Promise<any> {

    return this
      .http
      .get(ApiUrl.baseUrl + 'api/invoices/nextAttachments/' + attachmentID)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  public saveInvoice(invoiceDetail):Promise<any> {
    let data = JSON.stringify(invoiceDetail);
    return this
      .http
      .post(ApiUrl.baseUrl + 'api/invoices/newOrUpdate', data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }

  deleteInvoice(invoiceID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getInvoiceDelete/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

   submitInvoicebatch(invoiceID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getInvoicebatch/" + invoiceID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

  rejectInvoice(invoiceID, companyID, invAmount, rejectionComment , documentLockingID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/reject/" + invoiceID + "/" + companyID
       + "/" + invAmount + "/" + rejectionComment + "/" + documentLockingID)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

   approveInvoice(invoiceID, invoiceAmount, aprovalComment, companyID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/dashboard/approveInvoice/" + invoiceID + "/" + invoiceAmount + "/" + aprovalComment + "/" + companyID )
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }


    saveDistributionComment(distributionID , distributionComment) {
    return this.http
      .get(ApiUrl.baseUrl + "api/dashboard/distributionComment/" + distributionID + "/" + distributionComment)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
