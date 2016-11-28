import { Component, OnInit , Output , Input, EventEmitter} from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/shared/dashboard.service';



export class CompanyPathArgument {
    syncTypeID: string = '-1';
    companyType: string = 'Company Type';
}

@Component({
    selector: 'sp-companyPath-dropdown',
    templateUrl: './company-path.component.html'
})

export class CompanyPathDropdownComponent extends BaseComponent implements OnInit {
    @Output()
    public companyPathChanged: EventEmitter<CompanyPathArgument> = new EventEmitter<CompanyPathArgument>();
    @Input() companyPathFiltered: CompanyPathArgument = new CompanyPathArgument();
    private skyPanionTypeList: Array<any> = [];
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        private dashboardService: DashboardService
    ) {
        super(localStorageService, router);
        this.skyPanionTypeList = new Array<any>();
        this.getSkyPanionType();
    }

    ngOnInit() {
    }

    public getSkyPanionType() {
        let item = [{ ID: 'all', Name: 'All' }, { ID: 'Fund', Name: 'Fund' }, { ID: 'Property', Name: 'Property' }];
        for (let i = 0; i < 3; i++) {
            this.skyPanionTypeList.splice(i, 0, item[i]);

            this.skyPanionTypeList.map((skyPanionType) => {
                if (skyPanionType.ID === this.companyPathFiltered.syncTypeID) {
                   this.companyPathFiltered.companyType = skyPanionType.Name;
                }
            });
        }
    }

    private selectCompanyType(id): void {
        this.skyPanionTypeList.map((skyPanionType) => {
            if (skyPanionType.ID === id) {
                this.companyPathFiltered.syncTypeID = id;
                 this.companyPathFiltered.companyType = skyPanionType.Name;
            }
        });
        this.companyPathChanged.emit(this.companyPathFiltered);
    }
}
