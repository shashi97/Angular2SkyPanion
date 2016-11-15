import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
@Injectable()

export class AccountService {
    constructor(private http: Http) {

    }

    private apiServiceBase: string = 'http://localhost:5000/';

   
    public getAccountName(attachemntID, userID, documentType) {
        return this.http
            .get(this.apiServiceBase + "api/accounts")
            .map((res: Response) => res.json());
    }

    

}
