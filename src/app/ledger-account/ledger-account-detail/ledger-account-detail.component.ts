import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { LedgerAccountModel } from '../shared/ledger-account.model';


import { UserService } from '../../user/shared/user.service';
import { LedgerAccountService } from '../shared/ledger-account.service';


@Component({
    selector: 'sp-ledger-account-detail',
    templateUrl: './ledger-account-detail.component.html',
})

export class LedgerAccountDetailComponent extends BaseComponent implements OnInit {

    private id: number = 0;
    private companyId: number = 0;
    private currentPage: number = 1;
    private pageSize: number = 25;
    private ledgerAccountDetail: LedgerAccountModel;
    private ledgerAccounts: Array<LedgerAccountModel>;
    private totalItems: number = 0;
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private ledgerAccountService: LedgerAccountService
    ) {
        super(localStorageService, router);
        this.ledgerAccountDetail = new LedgerAccountModel();

        this.getParameterValues();
    }

    ngOnInit() {
    }

    private getParameterValues(): void {
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            this.getSessionDetails();
        });
    }

    private getSessionDetails() {
        this.user = this.userService.getSessionDetails();
        if (this.user.userId !== undefined) {
            if (this.user.IsSuperUser === true) {
                this.getledgerAccountsDetail();
            }else {
                let link = ['/company'];
                this.router.navigate(link);
            }
        }
    }

    private getledgerAccountsDetail() {
        this.ledgerAccountService.getledgerAccountsDetail(this.id, this.companyId).then(result => {
            this.ledgerAccountDetail = result;
            this.getledgerAccountDistribution(this.id);
        });
    }

    private getledgerAccountDistribution(id: number) {
        this.ledgerAccountService.getledgerAccountDistribution(id, this.currentPage, this.pageSize).then((result) => {
            this.ledgerAccounts = result;
            this.totalItems = this.ledgerAccounts[0].TotalCount;
        });
    }
}
