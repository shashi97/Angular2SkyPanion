import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';

@Component({
    selector: 'sp-invoice-detail',
    templateUrl: './invoice-detail.component.html',
})

export class InvoiceDetailComponent extends BaseComponent implements OnInit {

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}