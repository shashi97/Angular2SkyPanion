import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';
import { UserFilterArguments } from '../../shared/dropdown/user/user-dropdown.component';
@Component({
    selector: 'sp-filter-invoice-attribute',
    templateUrl: './filter-invoice.component.html'
})

export class FilterInvoiceComponent extends BaseComponent implements OnInit {

    private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
    private _userFilteredValue: UserFilterArguments = new UserFilterArguments();
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        public confirmService: ConfirmService,
        private syncBatchEntryService: SyncBatchService
    ) {
        super(localStorageService, router);

    }

    ngOnInit() {
    }

    private get companyFilteredArg(): CompanyFilterArguments {
        return this._companyFilteredValue;
    }

    private set companyFilteredArg(newValue: CompanyFilterArguments) {
        this._companyFilteredValue = newValue;
    }

    public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
        this.companyFilteredArg = filteredValue;
    }

    private get userFilteredArg(): UserFilterArguments {
        return this._userFilteredValue;
    }

    private set userFilteredArg(newValue: UserFilterArguments) {
        this._userFilteredValue = newValue;
    }

    public onUserFiltered(filteredValue: UserFilterArguments): void {
        this.userFilteredArg = filteredValue;
    }


    private searchURL(): void {
        let link = ['/syncbatcheNew/' +
            this.companyFilteredArg.companyId +
            ',' + this.userFilteredArg.UserID +
            '/' + 0 +
            '/new'];
        this.router.navigate(link);

    }

    private searchURLReset(): void {
        this.companyFilteredArg.companyId = 0;
        this.userFilteredArg.UserID = -1;
        this.searchURL();
    }

}




