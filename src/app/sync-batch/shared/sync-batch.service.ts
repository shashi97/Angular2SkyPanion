import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class SyncBatchService {
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


    public releaseInvoiceforSyncing(syncInvoices): Promise<any> {
        let data = JSON.stringify(syncInvoices);
        return this
            .http
            .post(ApiUrl.baseUrl + 'api/syncbatches/newOrUpdate', data)
            .toPromise()
            .then(response => response as any)
            .catch(this.handleError);

    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return error;
    }

    public getSyncBatches(searchCriteriaSyncBatches) {
        let data = JSON.stringify(searchCriteriaSyncBatches);

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json; charset=utf-8');

        return this.http
            .post(ApiUrl.baseUrl + 'api/syncbatches/PostSyncbatchSearch', data, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => error);
    }

    getSyncBatcheDetail(syncBatcheId) {
        return this.http.get(ApiUrl.baseUrl + 'api/syncbatches/' + syncBatcheId)
            .toPromise()
            .then(response => response.json())
            .catch(error => error);
    }

    rejectInvoice(invoiceID, companyID, invAmount, rejectionComment) {
        return this.http.get(ApiUrl.baseUrl + 'api/invoices/reject/'
            + invoiceID + '/'
            + companyID + '/'
            + invAmount + '/'
            + rejectionComment)
            .toPromise()
            .then((response) => response.json())
            .catch(error => error);


    }
}

