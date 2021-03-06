import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../config.component';
import { PurchaseOrder, LedgerAccounts, InvoiceDetail, Vendors, CompanyData } from '../../../invoice/invoice-entry/shared/invoice-entry.model';

@Injectable()
export class InvoiceEntryService {
  constructor(private http: Http) {

  }

  getPurchaseOrders(): Promise<any> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/purchaseorders/')
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }
  getLedgerAccountDDOsAccountTypeWise(companyID: number): Promise<any> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/ledgerAccounts/ledgerAccountDDOsAccountTypeWise/' + companyID)
      .toPromise()
      .then(response => response.json() as any)
      .catch(error => error);
  }
  getInvoiceDetail(invoiceId: number, attachmentId: number): Promise<InvoiceDetail> {
    var isFromEditWindow = true;
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/invoices/' + invoiceId + "/" + attachmentId + "/" + isFromEditWindow)
      .toPromise()
      .then(response => response.json() as InvoiceDetail)
      .catch(this.handleError);
  }
  getVendorById(CompanyID: number): Promise<any> {

    return this
      .http
      .get(ApiUrl.baseUrl + 'api/vendor/' + CompanyID)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  getCompanyDetail(CompanyID: number): Promise<any> {

    return this
      .http
      .get(ApiUrl.baseUrl + 'api/company/Details/' + CompanyID)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
