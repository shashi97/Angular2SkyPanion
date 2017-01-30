import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ApiUrl } from '../../config.component';
import { LocalStorageService } from 'angular-2-local-storage';



@Injectable()

export class UserService {

  sessionData: Object;
  dashboardStateData: Object;
  constructor(private http: Http,
    public localStorageService: LocalStorageService) {
    this.sessionData = {
      IsResetPasswordRequired: false,
      IsSuperUser: false,
      ImageName: '',
      Name: '',
      userName: '',
      AccountID: 0,
      userId: 0
    };
    this.dashboardStateData={
        companyId:0
    };
  }



  public sendResetPasswordEmail(email: string) {
    // let params: URLSearchParams = new URLSearchParams();
    // params.set('email', email);
    return this.http
      .get(ApiUrl.baseUrl + 'api/resetpassword/sendmail/' + email)
      .toPromise()
      .then(response => response)
      .catch(error => error);
  }

  public getSessionDetails(): Object {
    this.sessionData = this.localStorageService.get('sessionData');
    return this.sessionData;
  }

   public getDashboardState(): Object {
    this.dashboardStateData = this.localStorageService.get('dashboardStateData');
    return this.dashboardStateData;
  }

  public updateUserDetail(userName: string) {
    // let params: URLSearchParams = new URLSearchParams();
    // params.set('userName', userName);
    return this.http
      .post(ApiUrl.baseUrl + 'api/users/updatelogin/' + userName, {})
      .toPromise()
      .then(response =>
        response.json())
      .catch(error => error);
  }

  public getApproverUserDDOs(companyId) {
    return this.http.get(ApiUrl.baseUrl
      + 'api/users/companyApproverList/'
      + companyId)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getUserDDOs() {
    return this.http.get(ApiUrl.baseUrl + 'api/users/list')
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getUserById(userID) {
    return this.http
      .get(ApiUrl.baseUrl + 'api/users/' + userID)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }


  public getUsers(userTypeID, roleID, pageNumber, rowsPerPage) {

    let stringUrl = ApiUrl.baseUrl
      + 'api/users/' + userTypeID + '/' + roleID + '/' + pageNumber + '/' + rowsPerPage;

    return this.http.get(stringUrl)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public getEmailEventTypes() {
    return this.http.get(ApiUrl.baseUrl + 'api/users/getEmailEventTypes')
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public savePortalUser(userPortal) {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json, charset=utf-8');
    let data = JSON.stringify(userPortal);
    return this.http.post(ApiUrl.baseUrl + 'api/users/newOrUpdate', data, options)
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }

  public checkUserExistInInvoiceApproval(userID) {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json, charset=utf-8');
    return this
      .http
      .post(ApiUrl.baseUrl + 'api/users/chkUserExistinInvoiceApproval/' + userID, options)
      .toPromise()
      .then((result) => result)
      .catch(error => error);
  }

  public disableUser(userID) {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json, charset=utf-8');
    return this
    .http
    .post(ApiUrl.baseUrl + 'api/users/disable/' + userID, options)
    .toPromise()
    .then( (result) => result)
    .catch(error => error);
  }

  
  public getUserPermissions() {
    return this.http.get(ApiUrl.baseUrl + 'api/users/getDashboardUserPermissions')
      .toPromise()
      .then(response => response.json())
      .catch(error => error);
  }



  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
