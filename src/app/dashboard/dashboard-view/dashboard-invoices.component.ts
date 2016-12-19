import { Component, OnInit, Input, Output,ViewContainerRef, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';

import{DashboardInvoiceModel} from '../shared/dashboard-invoice.model';
import { UserService } from '../../user/shared/user.service';
import { MasterService } from '../../shared/services/master/master.service';
import { DashboardService } from '../shared/dashboard.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { DashboardStateModel } from '../shared/dashboard-state.model';
import { DashboardPermissionModel } from '../shared/dashboard-permissions.model';
import { InvoiceModelContext } from '../shared/invoice-context.model';
import { InvoiceDistributionModelContext } from '../shared/invoice-distribution-context.model';
import { InvoiceDistributionModel } from '../../invoice/shared/invoice-distribution.model';

import {InvoiceRejectModalComponent } from '../../dashboard/invoice-modals/invoice-rejection-modal/invoice-rejection.component';
import { InvoiceApprovalModalComponent } from '../../dashboard/invoice-modals/invoice-approval-modal/invoice-approval.component';
import { InvoiceDistributionCommentModalComponent } from '../../dashboard/invoice-modals/invoice-distribution-comment-model/invoice-distribution-comment.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'sp-dashboard-invoice',
  templateUrl: './dashboard-invoices.component.html',
   styleUrls:  ['../css/dashboard-invoices-distribution.css']
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
    private invoiceService:InvoiceService,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
     public toastr: ToastsManager
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
        this.toastr.error('This Invoice is locked by '+ result1.LockBy, 'Oops!');
      }else{
         this.invoiceService.deleteInvoice(invoice.InvoiceID).then(result2 => {
                    if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                            this.toastr.success('Invoice number ' + invoice.InvoiceNumber + ' delete successfully', 'Success!');
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
        this.toastr.error('This Invoice is locked by '+ result1.LockBy, 'Oops!');
      }else{
            this.invoiceService.submitInvoicebatch(invoice.InvoiceID).then(result2 => {
                if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                            this.toastr.success('Invoice number ' + invoice.InvoiceNumber + ' batched successfully', 'Success!');                            
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
        this.toastr.error('This Invoice is locked by '+ result1.LockBy, 'Oops!'); 
      }else{
            this.invoiceService.submitInvoiceExpedite(invoice.InvoiceID).then(result2 => {
                if (result2.Status == 500) {
                    }
                    else {
                        this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result3 => {
                           this.toastr.success('Invoice number ' + invoice.InvoiceNumber + ' expedited successfully', 'Success!');                                                        
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
                                     this.toastr.error('This Invoice is locked by '+ result1.LockBy, 'Oops!');
                                    return;
                                } else {
                                    this.invoiceService.submitInvoiceForApproval(invoice.InvoiceID).then(result3 => {
                                        if (result3.Status == 500) {
                                        }
                                        else {
                                            this.masterService.unlockDocument(invoice.InvoiceID, 0, 10).then(result4 =>{
                                            this.toastr.success('Invoice number ' + invoice.InvoiceNumber + ' submit for approval successfully', 'Success!');                                                        
                                               this.invoiceStateChange.emit(true);
                                            });
                                        }
                                    });
                                }
                            });
                    } else {
                         this.toastr.error('There are no approvers for this invoice', 'Oops!');
                    }
                })
  }


openRejectInvoiceModal(invoice: DashboardInvoiceModel){

      		const builder = new BSModalContextBuilder<InvoiceModelContext>(
            {
            invoiceID:invoice.InvoiceID,
            companyID:invoice.company_id,
            invoiceAmount:invoice.Amount,
            invoiceNumber:invoice.InvoiceNumber,
			} as any,
            undefined,
            InvoiceModelContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		return this.modal.open(InvoiceRejectModalComponent, overlayConfig)
			.catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
			.then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
			.then(result => {
				if (result != null) {
					 this.invoiceStateChange.emit(true);
				}
			});
}


openApprovalInvoiceModal(invoice: DashboardInvoiceModel){

      		const builder = new BSModalContextBuilder<InvoiceModelContext>(
            {
            invoiceID:invoice.InvoiceID,
            companyID:invoice.company_id,
            invoiceAmount:invoice.Amount,
            invoiceNumber:invoice.InvoiceNumber,
			} as any,
            undefined,
            InvoiceModelContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		return this.modal.open(InvoiceApprovalModalComponent, overlayConfig)
			.catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
			.then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
			.then(result => {
				if (result != null) {
					 this.invoiceStateChange.emit(true);
				}
			});
}



openInvoiceDistributionCommentModal(distribution:InvoiceDistributionModel, invoice: DashboardInvoiceModel){

      		const builder = new BSModalContextBuilder<InvoiceDistributionModelContext>(
            {
           	invDistributionID: distribution.DistributionID,
            invCompanyID:invoice.company_id,
            invoiceID:invoice.InvoiceID,
            invoiceNumber:invoice.InvoiceNumber
			} as any,
            undefined,
            InvoiceDistributionModelContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		return this.modal.open(InvoiceDistributionCommentModalComponent, overlayConfig)
			.catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
			.then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
			.then(result => {
				if (result != null) {
					 this.invoiceStateChange.emit(true);
				}
			});
    }
}
