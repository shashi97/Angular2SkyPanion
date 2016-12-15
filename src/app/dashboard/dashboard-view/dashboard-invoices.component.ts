import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';


import{DashboardInvoiceModel} from '../shared/dashboard-invoice.model';
import { UserService } from '../../user/shared/user.service';
import { MasterService } from '../../shared/services/master/master.service';
import { DashboardService } from '../shared/dashboard.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { DashboardStateModel } from '../shared/dashboard-state.model';
import { DashboardPermissionModel } from '../shared/dashboard-permissions.model';

@Component({
  selector: 'sp-dashboard-invoice',
  templateUrl: './dashboard-invoices.component.html',
})

export class DashboardInvoicesComponent extends BaseComponent implements OnInit {

  @Input() invoices: Array<DashboardInvoiceModel>;
  @Input() dashboardStatefilterItems: DashboardStateModel;
   @Input() dashboardPermissions : DashboardPermissionModel;
    @Output() invoiceStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private masterService:MasterService,
    private invoiceService:InvoiceService
  ) {
    super(localStorageService, router);
    console.log(this.invoices);
  }
  
  ngOnInit() {
    console.log(this.invoices);
  }

  
   private deleteInvoice(invoice: DashboardInvoiceModel):void{
    this.masterService.checkDocumentLocking(invoice.InvoiceID, 10).then(result1 => {
      if(result1.IsLocked == 0){
        alert("This Invoice is locked by " + result1.LockBy);
      }else{
         this.invoiceService.deleteInvoice(invoice.InvoiceID).then(result2 => {
                    if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                          this.invoiceStateChange.emit(true);
                        });
                    }
                });
          }
        });
  }

  private getInvoiceDetailsByID(invoice: DashboardInvoiceModel):void{

  }

  private submitInvoicebatch(invoice: DashboardInvoiceModel):void{
      this.masterService.checkDocumentLocking(invoice.InvoiceID, 10).then(result1 => {
      if(result1.IsLocked == 0){
        alert("This Invoice is locked by " + result1.LockBy);
      }else{
            this.invoiceService.submitInvoicebatch(invoice.InvoiceID).then(result2 => {
                if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                           this.invoiceStateChange.emit(true);
                        });
                    }
            });
      }
      });
  }

   private submitInvoiceExpedite(invoice: DashboardInvoiceModel):void{
     this.masterService.checkDocumentLocking(invoice.InvoiceID, 10).then(result1 => {
      if(result1.IsLocked == 0){
        alert("This Invoice is locked by " + result1.LockBy);
      }else{
            this.invoiceService.submitInvoiceExpedite(invoice.InvoiceID).then(result2 => {
                if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                           this.invoiceStateChange.emit(true);
                        });
                    }
            });
      }
      });
  }

    private SubmitInvoiceForApproval (invoice: DashboardInvoiceModel):void{
          this.invoiceService.getInvoiceApprovals(invoice.InvoiceID, invoice.Amount, invoice.company_id).then(result1 => {
                    if (result1.status == 404) {
                    }
                    else if (result1.status == 500) {
                    }
                    else {
                        var invApprovals = result1;
                    }
                    if (invApprovals != undefined && invApprovals.InvoiceApprovals != undefined && invApprovals.InvoiceApprovals.length > 0) {

                            this.masterService.checkDocumentLocking(invoice.InvoiceID, 10).then(result2 => {
                                if (result2.IsLocked == 0) {
                                    alert("This Invoice is locked by " + result2.LockBy);
                                    return;
                                } else {
                                    this.invoiceService.submitInvoiceForApproval(invoice.InvoiceID).then(result3 => {
                                        if (result3.Status == 500) {
                                        }
                                        else {
                                            this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result4 =>{
                                               this.invoiceStateChange.emit(true);
                                            });
                                        }
                                    });
                                }
                            });
                    } else {
                       alert("There are no approvers for this invoice");
                    }
                })
  }

  private updateDistributionComments (distribution: DashboardInvoiceModel):void{
      
  }

  private rejectInvoice (invoice: DashboardInvoiceModel):void{
  
  }

  private ApproveInvoice (invoice: DashboardInvoiceModel):void{
  
  }
 
}
