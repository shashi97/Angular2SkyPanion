import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import {PubSubService} from '../../interceptor/pub-service';

import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';
import { DashboardStateModel } from '../shared/dashboard-state.model';
import { DashboardPermissionModel } from '../shared/dashboard-permissions.model';
import { DashboardUserWisePermissionsModel } from '../shared/dashboard-permissions.model';
import { DashboardCompanyWisePermissionsModel } from '../shared/dashboard-permissions.model';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';

export class InvoiceStateFilterArguments {
  companyId: number = 0;
  invoiceState:  number = 1;
  isCompanyFilter:boolean = false;
  isTabApproveInvoice:boolean = false;
}

@Component({
  selector: 'sp-dashboard-state-filter',
  templateUrl: './dashboard-state-filter.component.html',
})


export class DashboardStateFilterComponent extends BaseComponent implements OnInit{
    showLoader;
   @Input() dashboardPermissions : DashboardPermissionModel;
   @Input() dashboardStatefilterItems: DashboardStateModel;
    @Output() filtered: EventEmitter<InvoiceStateFilterArguments> = new EventEmitter<InvoiceStateFilterArguments>();
    private filteredValue: InvoiceStateFilterArguments = new InvoiceStateFilterArguments();
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
    constructor(
    localStorageService: LocalStorageService,
    router: Router,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.filteredValue = new  InvoiceStateFilterArguments();

  }

  ngOnInit() {
       this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   private get companyFilteredArg(): CompanyFilterArguments {
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  }


 public onCompanyFiltered(_companyFilteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = _companyFilteredValue;
    this.filteredValue.isCompanyFilter = true;
    this.filteredValue.companyId  =_companyFilteredValue.companyId;
    this.filtered.emit(this.filteredValue);

  }

  private onInvoiceStateFiltered(invoiceState , isTabApproveInvoice): void {
    this.filteredValue.invoiceState  =invoiceState;
    this.filteredValue.isCompanyFilter = false;
    this.filteredValue.isTabApproveInvoice = isTabApproveInvoice;
    this.filtered.emit(this.filteredValue);
  }

}