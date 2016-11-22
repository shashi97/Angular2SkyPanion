import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { CompanyInfo, CompanyDetails } from './companies.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class CompaniesService {
  constructor(private http: Http) {

  }

  public getCompanies(sync: string,
    type: string,
    searchText: string,
    pageNumber: number,
    rowsPerPage: number): Promise<CompanyInfo[]> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/company/'
      + sync + '/'
      + type + '/'
      + searchText + '/'
      + pageNumber + '/'
      + rowsPerPage)
      .toPromise()
      .then(response => response.json() as CompanyInfo[])
      .catch(this.handleError);

  }

  public getCompanyDetails(companyId: number): Promise<CompanyDetails> {
    return this
      .http
      .get(ApiUrl.baseUrl + 'api/company/' + companyId)
      .toPromise()
      .then(response => response.json() as CompanyDetails)
      .catch(this.handleError);
  }

  public getCompanyChartData(status: string, companyId: number): Promise<CompanyDetails> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/company/'
      + status + '/'
      + companyId)
      .toPromise()
      .then(response => response.json() as CompanyDetails)
      .catch(this.handleError);
  }


  public activateDeactiveCompany(companyId: number, isActive: boolean): Promise<string> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/company/getactivateCompany/'
      + companyId + '/'
      + isActive)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public updateCompanyInvoiceRole(companyInvoiceRoleId: number, Rkey: string, companyId: number): Promise<string> {
    return this
      .http
      .get(ApiUrl.baseUrl
      + 'api/company/companyInvoiceRole/'
      + companyInvoiceRoleId
      + '/'
      + Rkey
      + '/'
      + companyId)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }




}
