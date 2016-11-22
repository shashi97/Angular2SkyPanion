
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
}
