import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { CompanyInfo } from './companies.model';
@Injectable()

export class CompaniesService {
   private apiServiceBase= 'http://192.168.1.60:5009/';
    constructor(private http: Http) {

    }

    public getCompanies(sync: string,
     type: string,
     searchText: string,
     pageNumber: number,
     rowsPerPage: number ): Promise<CompanyInfo[]> {
            return this
            .http
            .get(this.apiServiceBase + 'api/company/' + sync + '/' + type + '/' + searchText + '/' + pageNumber + '/' + rowsPerPage)
            .toPromise()
            .then(response => response.json() as CompanyInfo[])
            .catch(this.handleError);

        }

    public handleError(error: any): Promise<any> {
           console.error('An error occurred', error);
           return Promise.reject(error.message || error);
  }

}
