import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class AccountService {
    constructor(private http: Http) {

    }

    public getAccountName() {
        return this.http.get(ApiUrl.baseUrl + "api/accounts").toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
