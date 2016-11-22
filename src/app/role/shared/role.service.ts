import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';

import { ApiUrl } from '../../config.component';
import { RoleModel, RoleInfo } from './role.model';
@Injectable()

export class RoleService {
  constructor(private http: Http) {

  }

  public getRoles(): Promise<RoleInfo[]> {
    return this.http
      .get(ApiUrl.baseUrl + 'api/roles')
      .toPromise()
      .then(Response => Response.json() as RoleInfo[])
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  public getRoleTypes() {
    return this.http
      .get(ApiUrl.baseUrl + 'api/roles/roleType')
      .map((res: Response) => res.json());
  }

}
