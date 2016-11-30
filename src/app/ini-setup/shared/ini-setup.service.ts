import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class IniSetupService {

    constructor(private http: Http) {

    }

    getIniSetupDetails = function () {
        return this.http.get(ApiUrl.baseUrl + "api/iniSetup")
            .toPromise()
            .then(response =>
                response.json())
            .catch(error => error);
    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}