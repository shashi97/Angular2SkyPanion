import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ResetPasswordModel } from './reset-password.model';
import { ApiUrl } from '../../config.component';

@Injectable()
export class ResetPasswordService {
    constructor(private http: Http) {

    }
    public getUserDetail(resetPasswordToken): Promise<ResetPasswordModel> {
       return this.http
            .get(ApiUrl.baseUrl
            + 'api/resetpassword?resetPasswordToken='
            + resetPasswordToken)
            .toPromise()
            .then(response => response.json() as ResetPasswordModel)
            .catch(error => error);
    }
    public resetPassword(resetPasswordDetail) {

        let resetPassword = JSON.stringify(resetPasswordDetail);
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json; charset=utf-8');
        return this.http
            .post(ApiUrl.baseUrl
            + 'api/resetpassword'
            + resetPassword, options)
            .toPromise()
            .then(response => response)
            .catch(error => error);
    }

    //     this.resetPassword = function ($http, resetPasswordData, successCallBack) {
    //     var data = JSON.stringify(resetPasswordData);
    //     $http.post(apiServiceBase + "api/resetpassword", data).success(function (data) {
    //         successCallBack(data);
    //     });
    // }

    // public handleError(error: any): Promise<any> {
    //     console.error('An error occurred', error);
    //     return error;
    // }




}
