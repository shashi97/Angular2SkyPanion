import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';

import { ApiUrl } from '../../config.component';
import { RoleModel } from './role.model';
@Injectable()

export class RoleService {
  constructor(private http: Http) {

  }

  public getRoles() {
    return this.http
      .get(ApiUrl.baseUrl + 'api/roles')
      .toPromise()
      .then(Response => Response.json())
      .catch(error => error);
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

  public getRoleList(roleName, pageNumber, rowsPerPage): Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl
      + 'api/roles/'
      + roleName
      + '/'
      + pageNumber
      + '/'
      + rowsPerPage)
      .toPromise()
      .then(Response => Response.json() as any)
       .catch(error => error);
  }
  public getMemberRoleDetail(roleID): Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl
      + 'api/roles/member/'
      + roleID)
      .toPromise()
      .then(Response => Response.json() as any)
       .catch(error => error);
  }

  public getRolesByRoleId(roleId): Promise<any> {
    return this.http
      .get(ApiUrl.baseUrl
      + 'api/roles/'
      + roleId)
      .toPromise()
      .then((Response) => Response.json() as any)
      .catch(error => error);
  }


  public saveRole(role): Promise<any> {
    let data = JSON.stringify(role);
    return this.http
      .post(ApiUrl.baseUrl
      + 'api/roles/newOrUpdate'
      , data)
      .toPromise()
      .then((Response) => Response.json() as any)
       .catch(error => error);
  }

  public deleteRole(roleId): Promise<any> {
 let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http
      .post(ApiUrl.baseUrl
      + 'api/roles/delete/'
      + roleId, options)
      .toPromise()
      .then((Response) => Response as any)
       .catch(error => error);
  }

}

