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
        return this.http.get(ApiUrl.baseUrl
            + "api/ledgerAccounts/"
            + accountNumberSearch
            + "/" + accountTitleSearch
            + "/" + companyID + "/"
            + pageNumber
            + "/" + rowsPerPage)
            .toPromise()
            .then(response =>
                response.json())
            .catch(this.handleError);
    }

    getledgerAccountsDetail(id, companyID) {
        return this.http.get(ApiUrl.baseUrl
            + "api/ledgerAccounts/"
            + id + "/" + companyID)
            .toPromise()
            .then(response =>
                response.json())
            .catch(this.handleError);
    }

    getledgerAccountDistribution(id, pageNumber, rowsPerPage) {
        return this.http.get(ApiUrl.baseUrl
            + "api/ledgerAccounts/ledgerAccountDistribution/"
            + id
            + "/" + pageNumber
            + "/" + rowsPerPage)
            .toPromise()
            .then(response =>
                response.json())
            .catch(this.handleError);
    }

    getLedgerAccountDDOsAccountTypeWise (companyId) {
        return this.http.get(ApiUrl.baseUrl
            + "api/ledgerAccounts/ledgerAccountDDOsAccountTypeWise/"
            + companyId)
             .toPromise()
            .then(response =>
                response.json())
            .catch(this.handleError);
        }

    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}