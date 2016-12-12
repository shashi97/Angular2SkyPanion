import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../config.component';
import 'Rxjs/Rx';
@Injectable()

export class MasterService {
  constructor(private http: Http) {

  }

  public getItemsPerPageList() {
    var types = [25, 50, 100, 150];
    var list = [];
    for (var i = 0; i < types.length; i++) {
      var item = { value: types[i], id: i + 1 };
      list.splice(1, 0, item);
    }
    return list;
  }

  public unlockDocument(attachemntID, userID, documentType): Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getRemoveDocumentLock/" + attachemntID + "/" + userID + "/" + documentType)
      .toPromise()
      .then(response => response.json())
  }
  public checkDocumentLocking(attachemntID, documentType) {
    return this.http.get(ApiUrl.baseUrl + "api/invoices/getDocumentLockStatus/" + attachemntID + "/" + documentType)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public checkLockedDocumentState(documentLockingID, documentType, attachemntID): Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl + "api/invoices/getcheckLockedDocumentState/" + documentLockingID + "/" + documentType + "/" + attachemntID)
      .toPromise()
      .then(response => response.json())

  }

}
