import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Location } from '@angular/common';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

import { UserService } from '../../user/shared/user.service';
import { SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';

import { SyncBatchEntryFilterArguments } from './filter-invoice.component';

@Component({
  selector: 'sp-sync-batch-entry',
  templateUrl: './sync-batch-entry.component.html'
})

export class SyncBatchEntryComponent extends BaseComponent implements OnInit {

  private syncBatcheInvoices: Array<SyncBatchEntryModel>;
  private parameterValue: any;
  private totalItems: number = 0;
  private rejectionComment: string = '';

  private searchString: string = '';

  private _filteredValue: SyncBatchEntryFilterArguments = new SyncBatchEntryFilterArguments();

  constructor(
    private userService: UserService,
    localStorageService: LocalStorageService,
    router: Router,
    private route: ActivatedRoute,
    private syncBatchEntryService: SyncBatchService,
    private location: Location
  ) {
    super(localStorageService, router);
    //  this.syncBatcheInvoices = new Array<SyncBatchEntryModel>();
  }

  ngOnInit() {
    this.getSessionDetails();
  }

  private get filteredValue(): SyncBatchEntryFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: SyncBatchEntryFilterArguments) {
    this._filteredValue = newValue;

    this.searchString = this.filteredValue.companyId + ','
      + this.filteredValue.userId;

    this.getSyncBatcheInvoices();
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
      // this.parameterValue = ((params) ? params : 1);
      // if (this.parameterValue.SearchParameters) {
      //   let parameterArray: Array<any> = this.parameterValue.SearchParameters.split(',');
      //   this.filteredValue.companyId = Number(parameterArray[0]);
      //   this.filteredValue.userId = Number(parameterArray[1]);
      // }
      let searchParameters = params['searchParameters'];
      if (searchParameters !== '-1') {
        let parameterArray: Array<string> = searchParameters.split(',');
        this.filteredValue.companyId = parseInt(parameterArray[0]);
        this.filteredValue.userId = parseInt(parameterArray[1]);
      }
    });

    this.searchString = this.filteredValue.companyId + ','
      + this.filteredValue.userId;

    this.getSyncBatcheInvoices();
  }

  private getSyncBatcheInvoices(): void {

    this.location.replaceState('syncBatcheNew/' + this.searchString);
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
      companyID: this.filteredValue.companyId,
      userID: this.filteredValue.userId
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

  public onFiltered(filteredValue: SyncBatchEntryFilterArguments): void {
    this.filteredValue = filteredValue;
  }

}



