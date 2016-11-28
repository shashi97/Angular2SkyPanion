import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { CompanyModel } from '../shared/company.model';


@Component({
    selector: 'sp-company-title',
    templateUrl: './company-title.component.html',
})

export class CompanyTitleComponent extends BaseComponent implements OnInit {

    @Input() company: CompanyModel;

    constructor(
        localStorageService: LocalStorageService,
        router: Router
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
