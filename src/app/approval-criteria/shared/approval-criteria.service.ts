import { Http } from '@angular/http';
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

  deleteApprovalCriteria(approvalCriteriaID) {

    return this.http
      .post(ApiUrl.baseUrl + 'api/approvalcriteria/delete/' + approvalCriteriaID, {})
      .toPromise()
      .then(response =>
        response)
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
