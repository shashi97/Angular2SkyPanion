import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { LedgerAccountModel } from './shared/ledger-account.model';
import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';
import { MasterService } from '../shared/services/master/master.service';
import { UserService } from '../user/shared/user.service';
import { AccountService } from '../account/shared/account.service';
import { LedgerAccountService } from './shared/ledger-account.service';


@Component({
    selector: 'sp-ledger-account',
    templateUrl: './ledger-account.component.html',
})

export class LedgerAccountComponent extends BaseComponent implements OnInit {

    private ledgerAccountModel: LedgerAccountModel;
    private companies: Array<any>;
    private itemsPerPageList: Array<any>;
    private pageSize: number = 25;
    private pageSizeFilter: number = 25;
    private currentPage: number = 1;
    private totalItems: number = 0;
    private account: Object;
    private companyId: number = 0;

    private accountNumberSearch: string = null;
    private accountTitleSearch: string = null;

    options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ name: 'Account Number', prop: 'AccountNumber' }),
            new TableColumn({ name: 'Title', prop: 'AccountTitle' }),
            new TableColumn({ name: '# of invoices', prop: 'invCount' }),
        ]
    });

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
        this.ledgerAccountModel = new LedgerAccountModel();
        this.getParameterValues();
    }

    ngOnInit() {
    }

    private getParameterValues(): void {
        let searchParam = this.activatedRoute.params.subscribe(params => {
            let searchParameters = params['searchParameters'];
            if (searchParameters) {
                var parameterArray = searchParameters.split(',');
                this.accountNumberSearch = parameterArray[0] == 'null' ? null : parameterArray[0];
                this.accountTitleSearch = parameterArray[1] == 'null' ? null : parameterArray[1];
            }
            this.getItemsPerPageList();
        });
    }
    private getItemsPerPageList(): void {
        this.itemsPerPageList = this.masterService.getItemsPerPageList();
        this.pageSize = 25;
        this.pageSizeFilter = 25;
        this.getSessionDetails();
    }

    private getSessionDetails(): void {
        this.user = this.userService.getSessionDetails();
        if (this.user.userId != null) {
            if (this.user.IsSuperUser == true) {
                this.getAccountName();
            }
            else {
                let link = ['/company'];
                this.router.navigate(link);
            }
        }
    }

    private getAccountName(): void {
        this.accountService.getAccountName().then((result) => {
            if (result.status == 404 || result.status == 500) {
            }
            else {
                this.account = result;
                this.getLedgerAccounts();
            }
        });
    }

    private getLedgerAccounts(): void {
        if (this.pageSizeFilter != null) {
            this.pageSize = this.pageSizeFilter;
        }

        if (this.accountNumberSearch == "" || this.accountNumberSearch == undefined || this.accountNumberSearch == "null") {
            this.accountNumberSearch = null;
        }

        if (this.accountTitleSearch == "" || this.accountTitleSearch == undefined || this.accountTitleSearch == "null") {
            this.accountTitleSearch = null;
        }
        this.companyId = 0;

        this.ledgerAccountService.getLedgerAccounts(
            this.accountNumberSearch,
            this.accountTitleSearch,
            this.companyId,
            this.currentPage,
            this.pageSize)
            .then((result) => {
                this.ledgerAccountModel.LedgerAccountGridArray = result;
                if (this.ledgerAccountModel.LedgerAccountGridArray[0] != undefined) {
                    if (this.ledgerAccountModel.LedgerAccountGridArray[0].TotalCount != undefined) {
                        this.totalItems = this.ledgerAccountModel.LedgerAccountGridArray[0].TotalCount;
                    }
                }
                // var instanseId = paginationService.getLastInstanceId();
                // paginationService.setCurrentPage(instanseId, this.currentPage);
            });
    }

    private searchUrl(): void {
        if (this.accountNumberSearch == "" || this.accountNumberSearch == undefined || this.accountNumberSearch == "null") {
            this.accountNumberSearch = null;
        }

        if (this.accountTitleSearch == "" || this.accountTitleSearch == undefined || this.accountTitleSearch == "null") {
            this.accountTitleSearch = null;
        }

        let link = ['/ledgerAccount', this.accountNumberSearch + "," + this.accountTitleSearch];
        this.router.navigate(link);
    }

    private searchUrlReset(): void {
        this.currentPage = 1;
        this.pageSize = 25;
        this.accountNumberSearch = "";
        this.accountTitleSearch = "";
        this.searchUrl();
    }
}