import { Http, URLSearchParams, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { SyncBatchModel } from './sync-batch.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class SyncBatchService {

  constructor(private http: Http) {
  }

  public getSyncBatches(searchCriteriaSyncBatches) {
    var data = JSON.stringify(searchCriteriaSyncBatches);

    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json; charset=utf-8');

    return this.http
      .post(ApiUrl.baseUrl + "api/syncbatches/PostSyncbatchSearch", data, options)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getSyncBatcheDetail(syncBatcheId) {
    return this.http.get(ApiUrl.baseUrl + "api/syncbatches/" + syncBatcheId)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

}
