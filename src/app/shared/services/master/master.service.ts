import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
@Injectable()

export class MasterService {
    constructor(private http: Http) {

    }

    private apiServiceBase: string = 'http://localhost:8009/';

    public getItemsPerPageList(reportPluginId) {
        var types = [25, 50, 100, 150];
        var list = [];
        for (var i = 0; i < types.length; i++) {
            var item = { value: types[i], id: i + 1 };
            list.splice(1, 0, item);
        }
        return list;
    }

    public unlockDocument(attachemntID, userID, documentType) {
        return this.http
            .get(this.apiServiceBase + "api/invoices/getRemoveDocumentLock/" + attachemntID + "/" + userID + "/" + documentType)
            .map((res: Response) => res.json());
    }

    

}
