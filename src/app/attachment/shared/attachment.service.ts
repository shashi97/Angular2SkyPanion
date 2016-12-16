import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { ApiUrl } from '../../config.component';
import { AttachmentObject } from '../../attachment/shared/attachment.model';

@Injectable()
export class AttachmentService {
  constructor(private http: Http) {

  }

  getAttachments(companyID:number,status:string,pageNumber:number,rowsPerPage:number): Promise<AttachmentObject[]> {
      // var companyID = 0;
      // var status = "all";
      // var pageNumber = 1;
      // var rowsPerPage = 25;
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/attachments/' + companyID + "/" + status + "/" + pageNumber + "/" + rowsPerPage)
      .toPromise()
      .then(response => response.json() as AttachmentObject[])
      .catch(this.handleError);
  }

 deleteAttachement(attachemntID:number){
    return this
      .http
      .get(ApiUrl.baseUrl + "api/attachments/getDeleteAttachments/" + attachemntID)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

   changeAttachmentProperty(attachmentID, companyID, newCompanyNumber, oldCompanyNumber, attachmentName) {
    return this
      .http
      .get(ApiUrl.baseUrl  + "api/attachments/getChangeAttachmentProperty/" + attachmentID + "/" + companyID + "/" + newCompanyNumber + "/" + oldCompanyNumber + "/" + attachmentName)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
