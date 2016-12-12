import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { ApiUrl } from '../../../config.component';
import { PurchaseOrder,LedgerAccounts,InvoiceDetail,Vendors,CompanyData } from '../../../invoice/invoice-entry/shared/invoice-entry.model';

@Injectable()
export class InvoiceEntryService {
  constructor(private http: Http) {

  }

  getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/purchaseorders/')
      .toPromise()
      .then(response => response.json() as PurchaseOrder[])
      .catch(this.handleError);
  }
  getLedgerAccountDDOsAccountTypeWise(companyID:number): Promise<LedgerAccounts[]> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/ledgerAccounts/ledgerAccountDDOsAccountTypeWise/' + companyID)
      .toPromise()
      .then(response => response.json() as LedgerAccounts[])
      .catch(this.handleError);
  }
  getInvoiceDetail(invoiceId:number,attachmentId:number): Promise<InvoiceDetail> {
    var isFromEditWindow = true;
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/invoices/'+ invoiceId + "/" + attachmentId + "/" + isFromEditWindow)
      .toPromise()
      .then(response => response.json() as InvoiceDetail)
      .catch(this.handleError);
  }
    getVendorById(CompanyID:number): Promise<Vendors[]> {
    
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/vendor/'+ CompanyID)
      .toPromise()
      .then(response => response.json() as Vendors[])
      .catch(this.handleError);
  }
     getCompanyDetail(CompanyID:number): Promise<CompanyData> {
    
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/company/'+ CompanyID)
      .toPromise()
      .then(response => response.json() as CompanyData)
      .catch(this.handleError);
  }
  


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
