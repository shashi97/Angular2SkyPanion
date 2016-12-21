
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { ApiUrl } from '../../config.component';
import 'Rxjs/Rx';
@Injectable()

export class AccountService {
  constructor(private http: Http) {

  }
  public getAccountName() {
    return this.http
      .get(ApiUrl.baseUrl + 'api/accounts')
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  getAccount(accountId) {
    return this.http.get(ApiUrl.baseUrl + 'api/accounts/' + accountId)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
