import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';
//import { DashboardInvoicesComponent } from '../dashboard-view/dashboard-invoices.component';

import { UserService } from '../../user/shared/user.service';
import { MasterService } from '../../shared/services/master/master.service';
import { DashboardService } from '../shared/dashboard.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import{DashboardInvoiceModel} from '../shared/dashboard-invoice.model';
import { DashboardStateModel } from '../shared/dashboard-state.model';
import { DashboardModel } from '../shared/dashboard.model';
import { InvoiceStateFilterArguments } from './dashboard-state-filter.component';
import { DashboardPermissionModel } from '../shared/dashboard-permissions.model';
import { DashboardUserWisePermissionsModel } from '../shared/dashboard-permissions.model';
import { DashboardCompanyWisePermissionsModel } from '../shared/dashboard-permissions.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'sp-dashboard',
  templateUrl: './dashboard-view.component.html',
})

  
export class DashboardViewComponent extends BaseComponent implements OnInit {

 private dashboardPermissions :DashboardPermissionModel;
   private dashboardData: DashboardModel;
   private invoices: DashboardInvoiceModel[];
   private companyId:number = 0;
   private invoiceState :number = 0;
   private totalItems:number = 0;
   private invoiceForValidApprovalCount = 0;
    private _filteredValue: InvoiceStateFilterArguments = new InvoiceStateFilterArguments();
    constructor(
    private userService: UserService,
    private masterService: MasterService,
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private dashboardService:DashboardService,
    invoiceService:InvoiceService,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
    this.companyId = 0;
    this.invoiceState =5;
    this.totalItems = 0;
    this.invoiceForValidApprovalCount = 0;
      this.getSessionDetails();
  }
   ngOnInit() {
  }

  private getSessionDetails(): void {

     this.userService
      .getUserPermissions().then((result) => {
        if (result) {
          this.dashboardPermissions = result;
          this.sessionDetails = this.userService.getSessionDetails();
          this.dashboardPermissions.UserPermissions.IsSuperUser = this.sessionDetails.IsSuperUser;
            if (this.sessionDetails.userId != null) {
              this.getInvoices();
            } else {
              let link = ['/login'];
              this.router.navigate(link);
            }
        }
      });
  }

   private getInvoices(): void {
      this.dashboardService
      .getInvoices(
      this._filteredValue.companyId,
      null).then((result) => {
        if (result) {
          this.dashboardData = result;
          this.invoices = result.invoiceObjects;
          this.getInvoicesByState(this._filteredValue);
        }
      });
   }

    private get filteredValue(): InvoiceStateFilterArguments {
    return this._filteredValue;
  }

  private set filteredValue(newValue: InvoiceStateFilterArguments) {
    this._filteredValue = newValue;
    if(this._filteredValue.isCompanyFilter == true){
      this.getInvoices();
    }else{
      this.getInvoicesByState(newValue);
    }
  }

   public onFiltered(filteredValue: InvoiceStateFilterArguments): void {
    this.filteredValue = filteredValue;

  }

  public onFilteronInvoiceStateChangeed(value):void{
      this.getInvoices();    
  }

  private getInvoicesByState(filteredValue: InvoiceStateFilterArguments):void{
     
     this.invoiceForValidApprovalCount = 0;
      if(filteredValue.invoiceState ==1){
          this.dashboardData.InvStateCount.dashboardHeader = 'Invoices To Review'; 
          this.dashboardData.InvStateCount.relevantInvoiceState = 1;
      }else if(filteredValue.invoiceState ==2 && filteredValue.isTabApproveInvoice == true){
          this.dashboardData.InvStateCount.dashboardHeader = 'Invoices To Approve';
          this.dashboardData.InvStateCount.relevantInvoiceState = 2;
           this.dashboardData.InvStateCount.isApprove = true;
          
      }else if(filteredValue.invoiceState ==2 &&  filteredValue.isTabApproveInvoice == false){
          this.dashboardData.InvStateCount.dashboardHeader = 'Invoices To Override';
          this.dashboardData.InvStateCount.relevantInvoiceState = 2;
           this.dashboardData.InvStateCount.isApprove = false;
          
      }else if(filteredValue.invoiceState ==3){
          this.dashboardData.InvStateCount.dashboardHeader = 'Invoices To Batch';
          this.dashboardData.InvStateCount.relevantInvoiceState = 3;
          
      }else if(filteredValue.invoiceState ==5){
          this.dashboardData.InvStateCount.dashboardHeader = 'Invoices To Reject';
          this.dashboardData.InvStateCount.relevantInvoiceState = 5;
          
      }else{
        this.dashboardData.InvStateCount.dashboardHeader = 'Nothing';
          this.dashboardData.InvStateCount.relevantInvoiceState = 0;
        
      }

        if (filteredValue.companyId > 0 &&  this.dashboardData.invoiceObjects.length >0) {
            if(this.dashboardData.InvStateCount.relevantInvoiceState == 2 && this.dashboardData.InvStateCount.isApprove == false){
                this.invoices =  this.dashboardData.invoiceObjects.filter(function (item) {
                    return (item.company_id == filteredValue.companyId && item.InvoiceState == filteredValue.invoiceState &&  item.IsInvoiceOverride == true);
                })
            }else{
                 this.invoices =  this.dashboardData.invoiceObjects.filter(function (item) {
                    return (item.company_id == filteredValue.companyId && item.InvoiceState == filteredValue.invoiceState);
                })
            }
        }else {
           if(this.dashboardData.InvStateCount.relevantInvoiceState == 2 && this.dashboardData.InvStateCount.isApprove == false){
              this.invoices =  this.dashboardData.invoiceObjects.filter(function (item) {
                return (item.InvoiceState == filteredValue.invoiceState &&  item.IsInvoiceOverride == true);
            })
           }else{
             this.invoices =  this.dashboardData.invoiceObjects.filter(function (item) {
                return (item.InvoiceState == filteredValue.invoiceState);
            })
           }
            
        }

         this.totalItems = this.invoices.length;
         for (var i = 0; i < this.invoices.length ; i++) {
            if (this.invoices[i].IsApprovalRequired == true && this.invoices[i].InvoiceState == 2 && this.dashboardData.InvStateCount.dashboardHeader == 'Invoices To Approve') {
                 this.invoiceForValidApprovalCount = this.invoiceForValidApprovalCount + 1;
                break;
            }
        }

  }

  private releaseAllInvoicesForBatch():void{

     var invoicesForBatchRelease = [];

        for (var i = 0 ; i < this.invoices.length ; i++) {
            if (this.invoices[i].IsBatche == true && this.invoices[i].InvoiceState == 3) {
                invoicesForBatchRelease.push(this.invoices[i]);
            }
        }

        if (invoicesForBatchRelease.length > 0) {

            this.dashboardService.releaseAllInvoicesForBatch(invoicesForBatchRelease).then(result => {
                if (result.Status == 500) {
                }
                else {
                  this.getInvoices();  
                }
            });


        }
        else {
        this.toastr.error('No Invoice can release to Batch', 'Oops!');
        }

  }

  private releaseAllInvoicesForApprove():void{

     var invoicesForBatchRelease = [];

        for (var i = 0 ; i < this.invoices.length ; i++) {
            if (this.invoices[i].IsApprovalRequired == true && this.invoices[i].InvoiceState == 2) {
                invoicesForBatchRelease.push(this.invoices[i]);
            }
        }

        if (invoicesForBatchRelease.length > 0) {

            this.dashboardService.releaseAllInvoicesForApprove(invoicesForBatchRelease).then(result => {
                if (result.Status == 500) {
                }
                else {
                  this.getInvoices();  
                }
            });
        }
        else {
        this.toastr.error('No Invoice can release to Approval', 'Oops!');
        }
  }
}