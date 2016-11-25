import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { LedgerAccountModel } from '../shared/ledger-account.model';

@Component({
    selector: 'sp-ledger-filter-bar',
    templateUrl: './filter-bar.component.html',
})

export class LedgerFilterComponent extends BaseComponent implements OnInit {

    @Input() ledgerAccountDetail: LedgerAccountModel;

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}