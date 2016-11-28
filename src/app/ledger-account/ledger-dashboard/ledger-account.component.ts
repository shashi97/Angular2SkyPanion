import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { LedgerAccountModel } from '../shared/ledger-account.model';
import { MasterService } from '../../shared/services/master/master.service';
import { UserService } from '../../user/shared/user.service';
import { AccountService } from '../../account/shared/account.service';
import { LedgerAccountService } from '../shared/ledger-account.service';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import {CurrentPageArguments} from '../../pagination/pagination.component';

@Component({
    selector: 'sp-ledger-account',
    templateUrl: './ledger-account.component.html',
})

export class LedgerAccountComponent extends BaseComponent implements OnInit {

    private ledgerAccounts: Array<LedgerAccountModel>;
    private totalItems: number = 0;
    private account: Object;
    private companyId: number = 0;
    private pageName: string = 'Ledger Account';
    private _currentPage: CurrentPageArguments = new CurrentPageArguments();

    private accountNumberSearch: string = '';
    private accountTitleSearch: string = '';

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private activatedRoute: ActivatedRoute,
        private masterService: MasterService,
        private userService: UserService,
        private accountService: AccountService,
        private ledgerAccountService: LedgerAccountService
    ) {
        super(localStorageService, router);
        this.ledgerAccounts = new Array<LedgerAccountModel>();
        this.getParameterValues();
    }

    ngOnInit() {
    }

    private get currentPageFiltered(): CurrentPageArguments {
        return this._currentPage;
    }
    private set currentPageFiltered(newValue: CurrentPageArguments) {
        this._currentPage = newValue;
        this.getLedgerAccounts();
    }

    public onCurrentPageChanged(newValue: CurrentPageArguments) {
        this.currentPageFiltered = newValue;

    }

    private getParameterValues(): void {
        this.activatedRoute.params.subscribe(params => {
            let searchParameters = params['searchParameters'];
            if (searchParameters) {
                let parameterArray = searchParameters.split(',');
                this.accountNumberSearch = parameterArray[0];
                this.accountTitleSearch = parameterArray[1];
            }
            this.getItemsPerPageList();
        });
    }
    private getItemsPerPageList(): void {
        // this.itemsPerPageList = this.masterService.getItemsPerPageList();
        //this.pageSize = 25;
        //this.pageSizeFilter = 25;
        this.getSessionDetails();
    }

    private getSessionDetails(): void {
        this.user = this.userService.getSessionDetails();
        if (this.user.userId != null) {
            if (this.user.IsSuperUser === true) {
                this.getAccountName();
            } else {
                let link = ['/company'];
                this.router.navigate(link);
            }
        }
    }

    private getAccountName(): void {
        this.accountService.getAccountName().then((result) => {

            this.account = result;
            this.getLedgerAccounts();

        });
    }

    private getLedgerAccounts(): void {
        // if (this.pageSizeFilter != null) {
        //     this.pageSize = this.pageSizeFilter;
        // }

        this.companyId = 0;

        this.ledgerAccountService.getLedgerAccounts(
            this.accountNumberSearch,
            this.accountTitleSearch,
            this.companyId,
            this.currentPageFiltered.pageNo,
            this.currentPageFiltered.pageSizeFilter)
            .then((result) => {
                this.ledgerAccounts = result;
                if (this.ledgerAccounts[0] !== undefined) {
                    if (this.ledgerAccounts[0].TotalCount !== undefined) {
                        this.totalItems = this.ledgerAccounts[0].TotalCount;
                    }
                }
                // var instanseId = paginationService.getLastInstanceId();
                // paginationService.setCurrentPage(instanseId, this.currentPage);
            });
    }

    private searchUrl(): void {
        let link = ['/ledgerAccount', this.accountNumberSearch + ',' + this.accountTitleSearch];
        this.router.navigate(link);
    }

    private searchUrlReset(): void {
        this.currentPageFiltered.pageNo = 1;
        this.currentPageFiltered.pageSizeFilter = 25;
        this.accountNumberSearch = '';
        this.accountTitleSearch = '';
        this.searchUrl();
    }
}