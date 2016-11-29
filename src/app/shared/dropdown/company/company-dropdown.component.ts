import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/shared/dashboard.service';

export class CompanyFilterArguments {
    companyId: number = 0;
}


@Component({
    selector: 'sp-company-dropdown',
    templateUrl: './company-dropdown.component.html',
})

export class CompanyDropdownComponent extends BaseComponent implements OnInit {
    private companies: Array<any> = [];
    private selectedCompanyName: any;
    // @Output()
    // public companyFiltered: EventEmitter<CompanyFilterArguments> = new EventEmitter<CompanyFilterArguments>();
    // @Input() filtered: CompanyFilterArguments = new CompanyFilterArguments();
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
            let temp = this.companies;
        //     this.companies = [];
        //     temp.map((item: any) => {
        //         this.companies.push(
        //             { label: item.CompanyName, value: item });
        //     });
         });
    }
}

//     private selectedCompany(selectedCompany): void {
//        // this.filtered.companyId = selectedCompany.companyId;
//       //  this.companyFiltered.emit(this.filtered);
//     }
// }
