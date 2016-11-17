import { Http, Response, URLSearchParams,Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
@Injectable()

export class CompanyService {
  constructor(private http: Http) {

  }
createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('a20e6aca-ee83-44bc-8033-b41f3078c2b6:c199f9c8-0548-4be7-9655-7ef7d7bf9d20')); 
  }
  private apiServiceBase: string = 'http://localhost:5000/';
  public getCompanies(sync, type, searchText, pageNumber, rowsPerPage) {
    return this.http
      .get(this.apiServiceBase + "api/company/" + sync + "/" + type + "/" + searchText + "/" + pageNumber + "/" + rowsPerPage)
      .map((res: Response) => res.json());
  }

  public getXML = function () {

    // var headers = new Headers();
  	// this.createAuthorizationHeader(headers);
  	// headers.append('Accept', 'application/xml');

  	return this.http.get('https://randomuser.me/api', {
    }).map(res => res.json());
    // return this.http
    //   .get('http://localhost:8081/getXML')
    //   .map((res: Response) => res.json());
  }

  public getCompanyDetail(companyID) {
    return this.http
      .get(this.apiServiceBase + "api/company/" + companyID)
      .map((res: Response) => res.json());
  }


}
