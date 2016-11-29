import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { CompanyModel } from './company.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class CompanyService {
    constructor(private http: Http) {

    }

    public getCompanies(sync: string,
        type: string,
        searchText: string,
        pageNumber: number,
        rowsPerPage: number): Promise<any> {
        searchText = (searchText === '') ? null : searchText;
        return this
            .http
            .get(ApiUrl.baseUrl + 'api/company/'
            + sync + '/'
            + type + '/'
            + searchText + '/'
            + pageNumber + '/'
            + rowsPerPage)
            .toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);

    }

    public getCompanyDetail(companyId: number): Promise<CompanyModel> {
        return this
            .http
            .get(ApiUrl.baseUrl + 'api/company/' + companyId)
            .toPromise()
            .then(response => response.json() as CompanyModel)
            .catch(this.handleError);
    }

    public getCompanyChartData(status: string, companyId: number): Promise<CompanyModel> {
        return this
            .http
            .get(ApiUrl.baseUrl
            + 'api/company/'
            + status + '/'
            + companyId)
            .toPromise()
            .then(response => response.json() as CompanyModel)
            .catch(this.handleError);
    }

    public activateDeactiveCompany(companyId: number, isActive: boolean): Promise<any> {
        return this
            .http
            .get(ApiUrl.baseUrl
            + 'api/company/getactivateCompany/'
            + companyId + '/'
            + isActive)
            .toPromise()
            .then(response => response as any)
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

    public getCompanyDDOs() {
        return this.http.get(ApiUrl.baseUrl
            + 'api/company').toPromise()
            .then(response => response.json() as CompanyModel[])
            .catch(this.handleError);
    }

    public getCompanyName(companyId) {
        return this.http.get(ApiUrl.baseUrl
            + 'api/company/name/'
            + companyId)
            .toPromise()
            .then(response => response.json() as CompanyModel[])
            .catch(this.handleError);
    }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return error;
    }

}
