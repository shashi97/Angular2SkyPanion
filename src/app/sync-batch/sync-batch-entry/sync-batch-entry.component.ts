import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';
import { UserService } from '../../user/shared/user.service';

@Component({
    selector: 'sp-sync-batch-entry',
    templateUrl: './sync-batch-entry.component.html',
})

export class SyncBatchEntryComponent extends BaseComponent implements OnInit {

    constructor(
        private userService: UserService,
        localStorageService: LocalStorageService,
        router: Router

    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
        this.getSessionDetails();
    }

    private getSessionDetails(): void {
        this.sessionDetails = this.userService.getSessionDetails();
        if (this.sessionDetails.userId != null) {
            this.getSkypanionsCompanies();
        } else {
            let link = ['/login'];
            this.router.navigate(link);
        }
    }

    // need to add user and company

    private getSkypanionsCompanies(): void {


    }
}



