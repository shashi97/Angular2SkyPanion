import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class ApprovalCriteriaService {
  constructor(private http: Http) {
  }

  getApprovalCriteria(approvalType, companyId, pageNumber, rowsPerPage) {
    return this.http.get(ApiUrl.baseUrl
      + 'api/approvalcriteria/'
      + approvalType
      + '/' + companyId
      + '/' + pageNumber
      + '/' + rowsPerPage)
      .toPromise()
      .then(response =>
        response.json())
      .catch(error => error);
  }

  deleteApprovalCriteria(approvalCriteriaID): Promise<any> {
  let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http
      .post(ApiUrl.baseUrl + 'api/approvalcriteria/delete/' + approvalCriteriaID, options)
      .toPromise()
      .then(response =>
        response as any)
      .catch(error => error);
  }

  public saveApprovalCriteria(approvalCriteriaID, companyID, rangeStart, rangeEnd, userID, ledgerAccountID, type): Promise<any> {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json; charset=utf-8');
    return this
      .http
      .post(ApiUrl.baseUrl +
      'api/approvalcriteria/update/'
      + approvalCriteriaID
      + '/'
      + companyID
      + '/'
      + rangeStart
      + '/'
      + rangeEnd
      + '/'
      + userID
      + '/'
      + ledgerAccountID
      + '/'
      + type, options)
      .toPromise()
      .then(response => response as any)
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return error;
  }
}
