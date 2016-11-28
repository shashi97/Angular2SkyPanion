import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/shared/dashboard.service';


@Component({
    selector: 'sp-company-dropdown',
    templateUrl: './company-dropdown.component.html',
})

export class CompanyDropdownComponent extends BaseComponent implements OnInit {
    private companies: Array<any> = [];
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private dashboardService: DashboardService
    ) {
        super(localStorageService, router);
        this.getSkypanionsCompanies();
    }

    ngOnInit() {
    }

    private getSkypanionsCompanies(): void {
        this.dashboardService.getSkypanionsCompanies().then((result) => {
          this.companies = result;          
        });
    }
}