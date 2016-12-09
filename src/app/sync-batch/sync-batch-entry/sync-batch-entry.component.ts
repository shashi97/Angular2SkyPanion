import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';
import { UserService } from '../../user/shared/user.service';
import { SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';

@Component({
    selector: 'sp-sync-batch-entry',
    templateUrl: './sync-batch-entry.component.html'
})

export class SyncBatchEntryComponent extends BaseComponent implements OnInit {

    private syncBatcheInvoices: Array<SyncBatchEntryModel>;
    private parameterValue: any;
    private companyId: number = 0;
    private userId: number = -1;
    private totalItems: number = 0;
    private rejectionComment: string = '';
    constructor(
        private userService: UserService,
        localStorageService: LocalStorageService,
        router: Router,
        private route: ActivatedRoute,
        private syncBatchEntryService: SyncBatchService

    ) {
        super(localStorageService, router);
      //  this.syncBatcheInvoices = new Array<SyncBatchEntryModel>();
    }

    ngOnInit() {
        this.getSessionDetails();
    }

    private getSessionDetails(): void {
        this.sessionDetails = this.userService.getSessionDetails();
        if (this.sessionDetails.userId != null) {
            this.getParameterValues();
        } else {
            let link = ['/login'];
            this.router.navigate(link);
        }
    }

    private getParameterValues(): void {
     this.route.params.subscribe(params => {
       this.parameterValue = ((params) ? params : 1);
       if (this.parameterValue) {
         this.userId = Number(this.parameterValue.SearchParameters);
         this.companyId = Number(this.parameterValue.SyncBatcheID);
       }
     });
     this.getSyncBatcheInvoices();
    }

    private getSyncBatcheInvoices(): void {

            // this.companies.map((item) => {
            //     if (item.CompanyID === this.companyId) {
            //        // $scope.selectedCompany.selected = item;
            //     }
        //    };


            // this.users.map((item) => {
            //     if (item.UserID === this.userId) {
            //         this.userName = item.username;
            //         this.imagePath = item.ImagePath;
            //     }
            // });

            let searchFields = {
                companyID: this.companyId,
                userID: this.userId
            };
            this.syncBatchEntryService.getSyncBatcheInvoices(searchFields).then((result) => {
                if (result.status === 404) {
                  //  $location.path('/syncbatches');
                } else if (result.status === 500) {
                } else {
                    this.syncBatcheInvoices = result;
                    if (this.syncBatcheInvoices != null) {
                        this.totalItems = this.syncBatcheInvoices.length;
                    }
                }
            });
        }


}



