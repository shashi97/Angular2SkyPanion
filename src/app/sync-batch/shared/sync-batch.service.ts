import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class SyncBatchEntryService {
    constructor(private http: Http) {

    }

    public getSyncBatcheInvoices(searchFields): Promise<any> {
        let data = JSON.stringify(searchFields);
    //    let options = new RequestOptions();
    //     options.headers = new Headers();
        return this
            .http
            .post(ApiUrl.baseUrl + 'api/syncbatches/PostSyncInvoicesSearch', data)
            .toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);
}


        public releaseInvoiceforSyncing(syncInvoices): Promise<any>  {
            let data = JSON.stringify(syncInvoices);
               return this
            .http
            .post(ApiUrl.baseUrl + 'api/syncbatches/newOrUpdate', data)
            .toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);

        }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return error;
    }
}
