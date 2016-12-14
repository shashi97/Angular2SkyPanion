import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { ApiUrl } from '../../config.component';
@Injectable()

export class IniSetupService {

    constructor(private http: Http) {

    }

    public getIniSetupDetails(): Promise<any> {
        return this.http.get(ApiUrl.baseUrl + 'api/iniSetup')
            .toPromise()
            .then(response =>
                response.json())
            .catch(error => error);
    }
    public saveIniSetupDetails(iniSetup): Promise<any> {
        let data = JSON.stringify(iniSetup);
        return this.http.post(ApiUrl.baseUrl + 'api/iniSetup/save', data)
            .toPromise()
            .then((response) =>
                response)
            .catch(error => error);

    }

    public getServerDirectoriesfiles(filepath): Promise<any> {
        let data = JSON.stringify(filepath);
        return this.http.post(ApiUrl.baseUrl + 'api/iniSetup/getDrives', data)
            .toPromise()
            .then((response) =>
                response.json())
            .catch(error => error);
    }

    public saveSelectedfilePath(iniSetup): Promise<any> {
        let data = JSON.stringify(iniSetup);
        return this.http.post(ApiUrl.baseUrl + 'api/iniSetup/newOrUpdate', data)
            .toPromise()
            .then((response) =>
                response)
            .catch(error => error);
    }
    
    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
