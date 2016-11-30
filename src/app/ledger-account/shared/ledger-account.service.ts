import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { LedgerAccountModel } from './ledger-account.model';
import { ApiUrl } from '../../config.component';
@Injectable()

export class LedgerAccountService {

    constructor(private http: Http) {
    }

    getLedgerAccounts(accountNumberSearch, accountTitleSearch, companyID, pageNumber, rowsPerPage) {

        if (accountNumberSearch == '') {
            accountNumberSearch = null;
        }
        if (accountTitleSearch == '') {
            accountTitleSearch = null;
        }

        let urlString = ApiUrl.baseUrl
            + "api/ledgerAccounts/"
            + accountNumberSearch
            + "/" + accountTitleSearch
            + "/" + companyID + "/"
            + pageNumber
            + "/" + rowsPerPage;

        return this.http
            .get(urlString)
            .toPromise()
            .then(response =>
                response.json())
            .catch(error => error);
    }

    getledgerAccountsDetail(id, companyID) {

        let urlString = ApiUrl.baseUrl
            + "api/ledgerAccounts/"
            + id + "/" + companyID;

        return this.http
            .get(urlString)
            .toPromise()
            .then(response =>
                response.json())
            .catch(error => error);
    }

    getledgerAccountDistribution(id, pageNumber, rowsPerPage) {

        let urslString = ApiUrl.baseUrl
            + "api/ledgerAccounts/ledgerAccountDistribution/"
            + id
            + "/" + pageNumber
            + "/" + rowsPerPage;

        return this.http
            .get(urslString)
            .toPromise()
            .then(response =>
                response.json())
            .catch(error => error);
    }

    getLedgerAccountDDOsAccountTypeWise(companyId) {

        let urslString = ApiUrl.baseUrl
            + "api/ledgerAccounts/ledgerAccountDDOsAccountTypeWise/"
            + companyId;

        return this.http
            .get(urslString)
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