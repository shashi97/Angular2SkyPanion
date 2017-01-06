import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
import { InvoiceModel } from '../../invoice/shared/invoice.model';
import { DashboardModel } from '../shared/dashboard.model';

@Injectable()

export class DashboardService {

  constructor(private http: Http) {

  }

  getSkypanionsCompanies(isGeneral) {
    return this.http.get(ApiUrl.baseUrl + 'api/dashboard/skypanionsCompanies/'+isGeneral)
      .toPromise()
      .then(response =>
        response.json())
       .catch(error => error);
  }

  getInvoices(companyId: number, invoiceState: number): Promise<DashboardModel> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/dashboard/getDashboard/' + invoiceState + '/' + companyId +'/'+ 0)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  ApproveInvoice(invID, invAmount, comment, companyID) {
    return this
      .http
      .get(ApiUrl.baseUrl + "api/dashboard/approveInvoice/" + invID + "/" + invAmount + "/" + comment + "/" + companyID)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }
  releaseAllInvoicesForBatch(invoices) {
    var data = JSON.stringify(invoices);
    return this
      .http
      .post(ApiUrl.baseUrl + "api/dashboard/releaseInvoicesForBatch", data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  releaseAllInvoicesForApprove(invoices) {
    var data = JSON.stringify(invoices);
    return this
      .http
      .post(ApiUrl.baseUrl + "api/dashboard/releaseInvoicesForApprove", data)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }



  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}


