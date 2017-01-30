import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
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
import { UserFilterArguments } from '../../shared/dropdown/user/user-dropdown.component';

import { UserService } from '../../user/shared/user.service';

export class InvoiceStateFilterArguments {
  companyId: number = 0;
  invoiceState:  number = 1;
  isCompanyFilter:boolean = false;
  isTabApproveInvoice:boolean = false;
  userId:number = null;
}

@Component({
  selector: 'sp-dashboard-state-filter',
  templateUrl: './dashboard-state-filter.component.html',
})


export class DashboardStateFilterComponent extends BaseComponent implements OnInit , AfterViewInit{
    private showLoader = false;
   @Input() dashboardPermissions : DashboardPermissionModel;
   @Input() dashboardStatefilterItems: DashboardStateModel;
    @Output() filtered: EventEmitter<InvoiceStateFilterArguments> = new EventEmitter<InvoiceStateFilterArguments>();
    private filteredValue: InvoiceStateFilterArguments = new InvoiceStateFilterArguments();
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
  private _userFilteredValue: UserFilterArguments = new UserFilterArguments();

    constructor(
    localStorageService: LocalStorageService,
    router: Router,
    public pubsub: PubSubService,
    private userService: UserService,
  ) {
    super(localStorageService, router);
    this.filteredValue = new  InvoiceStateFilterArguments();

  }

  ngOnInit() {
       this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

  ngAfterViewInit(){
  this.dashboardState = this.userService.getDashboardState();
  }
 

   private get companyFilteredArg(): CompanyFilterArguments {
    this._companyFilteredValue = this.dashboardState;
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  //  this._companyFilteredValue.companyId =  this.dashboardState.companyId;

  }

  private get userFilteredArg(): UserFilterArguments {
    return this._userFilteredValue;
  }

  private set userFilteredArg(newValue: UserFilterArguments) {
    this._userFilteredValue = newValue;
  }

  public onUserFiltered(_userFilteredValue: UserFilterArguments): void {
    this.userFilteredArg = _userFilteredValue;
    this.filteredValue.isCompanyFilter = true;
    this.filteredValue.userId = this.userFilteredArg.UserID;
    this.filtered.emit(this.filteredValue);
  }

 public onCompanyFiltered(_companyFilteredValue: CompanyFilterArguments): void {
    this.companyFilteredArg = _companyFilteredValue;
    this.filteredValue.isCompanyFilter = true;
    this.filteredValue.companyId  =_companyFilteredValue.companyId;
    this.localStorageService.set('dashboardStateData', {
          companyId: _companyFilteredValue.companyId
        });
    this.filtered.emit(this.filteredValue);

  }

  private onInvoiceStateFiltered(invoiceState , isTabApproveInvoice): void {
    this.filteredValue.invoiceState  =invoiceState;
    this.filteredValue.isCompanyFilter = false;
    this.filteredValue.isTabApproveInvoice = isTabApproveInvoice;
    this.filtered.emit(this.filteredValue);
  }

}