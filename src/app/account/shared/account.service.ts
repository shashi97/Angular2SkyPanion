<<<<<<< HEAD
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AccountModel } from './account.model';

import { ApiUrl } from '../../config.component';
import 'Rxjs/Rx';
@Injectable()

export class AccountService {
  constructor(private http: Http) {

  }
  public getAccountName(): Promise<AccountModel> {
    return this.http
      .get(ApiUrl.baseUrl + 'api/accounts')
      .toPromise()
      .then(response => response.json() as AccountModel)
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
=======
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
>>>>>>> 78bb43a25ab820cb00fc637490e67ef92bb59b75

}
