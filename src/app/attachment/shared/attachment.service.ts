import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { ApiUrl } from '../../config.component';
import { AttachmentObject } from '../../attachment/shared/attachment.model';

@Injectable()
export class AttachmentService {
  constructor(private http: Http) {

  }

  getAttachments(): Promise<AttachmentObject[]> {
      var companyID = 0;
      var status = "all";
      var pageNumber = 1;
      var rowsPerPage = 25;
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/attachments/' + companyID + "/" + status + "/" + pageNumber + "/" + rowsPerPage)
      .toPromise()
      .then(response => response.json() as AttachmentObject[])
      .catch(error => error);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
