import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { CompanyInfo } from './companies.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class CompaniesService  {
    constructor(private http: Http) {

    }

    public getCompanies(sync: string,
     type: string,
     searchText: string,
     pageNumber: number,
     rowsPerPage: number ): Promise<CompanyInfo[]> {
            return this
            .http
            .get(ApiUrl.baseUrl + 'api/company/' + sync + '/' + type + '/' + searchText + '/' + pageNumber + '/' + rowsPerPage)
            .toPromise()
            .then(response => response.json() as CompanyInfo[])
            .catch(this.handleError);

        }

    public handleError(error: any): Promise<any> {
           console.error('An error occurred', error);
           return Promise.reject(error.message || error);
  }

}
