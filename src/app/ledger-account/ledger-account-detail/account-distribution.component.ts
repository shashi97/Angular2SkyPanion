import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { LedgerAccountModel } from '../shared/ledger-account.model';

@Component({
    selector: 'sp-ledger-account-distribution',
    templateUrl: './account-distribution.component.html',
})

export class LedgerAccountDistributionComponent extends BaseComponent implements OnInit {

    @Input() ledgerAccounts: Array<LedgerAccountModel>;

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
        console.log(this.ledgerAccounts);

    }

    ngOnInit() {
        console.log(this.ledgerAccounts);
    }
}