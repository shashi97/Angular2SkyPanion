import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ApiUrl } from '../../config.component';
import { LocalStorageService } from 'angular-2-local-storage';



@Injectable()

export class UserService {


  constructor(private http: Http,
    public localStorageService: LocalStorageService) {
  }

  sessionData: Object = {
    IsResetPasswordRequired: false,
    IsSuperUser: false,
    ImageName: '',
    Name: '',
    userName: '',
    AccountID: 0,
    userId: 0
  };

  public sendResetPasswordEmail(email: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', email);
    return this.http
      .get(ApiUrl.baseUrl + 'api/resetpassword/sendmail/', { search: params })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  public getSessionDetails(): Object {
    this.sessionData = this.localStorageService.get('sessionData');
    return this.sessionData;
  }

  public updateUserDetail(userName: string) {
    // let params: URLSearchParams = new URLSearchParams();
    //params.set('userName', userName);
    return this.http
      .post(ApiUrl.baseUrl + 'api/users/updatelogin/' + userName, {})
      .toPromise()
      .then(response =>
        response.json())
      .catch(this.handleError);
  }

  public getApproverUserDDOs(companyId) {
    return this.http.get(ApiUrl.baseUrl
      + "api/users/companyApproverList/"
      + companyId)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  public getUserDDOs() {
    return this.http.get(ApiUrl.baseUrl + "api/users/list")
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getUserById(userID) {
    return this.http
      .get(ApiUrl.baseUrl + "api/users/" + userID)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}  