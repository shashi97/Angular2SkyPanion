import { Component, OnInit, Input, ViewContainerRef,AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';

import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { InvoiceModel, InvApprovals } from '../shared/invoice.model';
import { MasterService } from '../../shared/services/master/master.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  InvoiceDetail, invSearchObject, PurchaseOrder, CompanyData, Vendors,
  LedgerAccounts, GlAccountObject, InvoiceExistItems, JobCategory
} from '../../invoice/invoice-entry/shared/invoice-entry.model';
import {
  InvoiceEntryNoApproverExistsModalContext,
  InvoiceEntryNoApproverExistsComponent
} from '../../invoice/invoice-entry-components/noApproverExists-model/invoice-entry-noApproverExists.component';
import { InvoiceModelContext } from '../../dashboard/shared/invoice-context.model';
import { DashboardInvoiceModel } from '../../dashboard/shared/dashboard-invoice.model';
import { InvoiceRejectModalComponent } from '../../dashboard/invoice-modals/invoice-rejection-modal/invoice-rejection.component';
import { InvoiceApproveModalComponent } from '../../invoice/invoice-detail/invalid-approve-modal.component';
@Component({
  selector: 'sp-invoice-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceDetailFilterComponent extends BaseComponent implements OnInit , AfterViewInit {
  @Input() invoices: Array<DashboardInvoiceModel>;
  @Input() invoiceDetail: InvoiceModel;
  private searchParameters;
  private InvoiceIDs;
  private invoiceIDs = {
    CurrentInvoiceID: '',
    NextInvoiceID: '',
    PreviousInvoiceID: ''
  };
  private invApprovals: InvApprovals;
  private invSearchObject: invSearchObject;
  private attachmentId;
  private InvoiceID;
  private DocumentLockingID;
  private DocumentID;
  private docType;
  private errorsInv = [];
  private errorHeader: string = '';
  private aprovalComment;
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private invoiceService: InvoiceService,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
    private toastr: ToastsManager
  ) {
    super(localStorageService, router);
    overlay.defaultViewContainer = vcRef;
    this.searchParameters = -1;
    this.invSearchObject = new invSearchObject();

  }

  ngOnInit() {
   
  }

 ngAfterViewInit(){
      setTimeout(() => {
       this.activatedRoute.params.subscribe(params => {
      this.invSearchObject.invoiceID = +params['InvoiceID'];
      this.invSearchObject.companyID = +params['company'];
      this.invSearchObject.invoiceNumber = params['invoiceNumber'];
      this.invSearchObject.statusID = params['status'];
      this.invSearchObject.userID = +params['user'];
      this.invSearchObject.vendorID = +params['vendor'];
      this.getInvoiceID();
      this.getInvoiceApprovals();
    });
    }, 500);
  }

  private getInvoiceID(): void {
    this.invoiceService.getInvoiceId(this.invSearchObject).then(result => {
      if (result.status = 404) {
        this.InvoiceIDs = '';
      } else {
        this.invoiceIDs = result;
      }
      // this.getInvoiceDetail();
    });
    
  }
  openRejectInvoiceModal(invoice) {

    const builder = new BSModalContextBuilder<InvoiceModelContext>(
      {
        invoiceID: invoice.InvoiceID,
        companyID: invoice.CompanyID,
        invoiceAmount: invoice.InvoiceAmount,
        invoiceNumber: invoice.InvoiceNumber,
      } as any,
      undefined,
      InvoiceModelContext
    );

    let overlayConfig: OverlayConfig = {
       context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceRejectModalComponent, overlayConfig)
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && parseInt(this.invoiceIDs.NextInvoiceID) > this.invoiceDetail.InvoiceID) {
            this.router.navigate(['/invoice/detail/' + parseInt(this.invoiceIDs.NextInvoiceID)]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      }, () => console.log(' Error In Filterbar  modal '));
    });
  }


  private getInvoiceDetailsByID(): void {
    this.masterService.checkDocumentLocking(this.invoiceDetail.InvoiceID, 10).then(result => {
      if (result.IsLocked === 0) {
        this.toastr.error('This Invoice is locked by' + result.LockBy, 'Oops!');
        return;
      } else {
          this.localStorageService.set('routeData' ,{ 
          prevoiusRoute: 'invoices',
        });
        this.router.navigate(['/invoices/' + this.searchParameters + '/' + this.invoiceDetail.InvoiceID
          + '/edit'], { queryParams: { status: this.invoiceDetail.InvoiceStatusID, amount: this.invoiceDetail.InvoiceAmount } });
        // $location.path('/invoices/'+$scope.searchParameters +'/'+ parseInt($scope.invoiceDetail.InvoiceID) 
        // + '/edit').search({ status: $scope.invoiceDetail.InvoiceStatusID, amount: $scope.invoiceDetail.InvoiceAmount });
      }
    });
  }

  openNoApproverExistsModal() {
    const builder = new BSModalContextBuilder<InvoiceEntryNoApproverExistsModalContext>(
      { num1: 2, num2: 3 } as any,
      undefined,
      InvoiceEntryNoApproverExistsModalContext
    );

    let overlayConfig: OverlayConfig = {
       context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceEntryNoApproverExistsComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          //this.GetSelectedPurchaseOrder(result);
        }
      }, () => console.log(' Error In Purchase modal '));
    });


  }

  private getInvoiceApprovals(): void {
    this.invoiceService.getInvoiceApprovals(
      this.invSearchObject.invoiceID,
      this.invoiceDetail.InvoiceAmount,
      this.invoiceDetail.CompanyID)
      .then(result => {
        if (result.status === 404) {
        } else if (result.status === 500) {
        } else {
          this.invApprovals = result;
        }
      });
  }

  private SubmitInvoiceForApproval(invoice): void {
    if (this.invoiceDetail.InvoiceID == 0) {
      this.docType = 5;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.AttachmentID;
    } else {
      this.docType = 10;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.InvoiceID;
    }
    if (this.invApprovals != undefined && this.invApprovals.InvoiceApprovals != undefined && this.invApprovals.InvoiceApprovals.length > 0) {
      this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID)
        .then(result => {
          if (result.IsLocked === 0) {
             this.toastr.error("error", "This invoice is locked by " + result.LockBy, "error");
            return;
          } else {
            if (invoice.InvoiceAmount !== 0.00 && invoice.InvoiceAmount !== 0) {
              this.invoiceService.submitInvoiceForApproval(invoice.InvoiceID).then(response => {
                if (response.status === 500) {
                } else {
                  this.toastr.success("Invoice submit for approval successfully");
                  if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && this.invoiceIDs.NextInvoiceID > invoice.InvoiceID) {
                    this.unlockDocument('/invoice/detail/' + parseInt(this.invoiceIDs.NextInvoiceID), invoice.InvoiceID);
                    // $location.path('/invoicesDetails/' + parseInt($scope.invoiceIDs.NextInvoiceID));
                  } else {
                    this.unlockDocument('/dashboard', invoice.InvoiceID);
                    // $location.path('/dashboard');
                  }
                }
              });
            } else {
              this.router.navigate(['/invoices/' + this.searchParameters + '/' + parseInt(invoice.InvoiceID) + '/edit'], { queryParams: { status: this.invoiceDetail.InvoiceStatusID, amount: this.invoiceDetail.InvoiceAmount } });
              return;
            }
          }
        });
    }
    else {
      this.openNoApproverExistsModal();
    }
  }


  private submitInvoiceExpedite(invoice): void {

    // only make let to avoid error Please give the exact value when you call the service    
   
    if (this.invoiceDetail.InvoiceID == 0) {
      this.docType = 5;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.AttachmentID;
    } else {
      this.docType = 10;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.InvoiceID;
    }

    this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID)
      .then(result => {
        if (result.IsLocked === 0) {
          this.toastr.error('This invoice is locked by' + result.LockBy, 'Oops!');
          // messageService.showMsgBox("error", "This invoice is locked by " + result.data.LockBy, "error");
          return;
        } else {
          if (invoice.InvoiceAmount > 0) {
            this.invoiceService.submitInvoiceExpedite(invoice.InvoiceID).then(response => {
              if (response.Status === 500) {
              } else {
                this.toastr.success('Invoice expedited successfully', 'Success!');
                if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && this.invoiceIDs.NextInvoiceID > invoice.InvoiceID) {
                  this.unlockDocument('/invoice/detail/' + parseInt(this.invoiceIDs.NextInvoiceID), invoice.InvoiceID);

                } else {
                  // $location.path('/dashboard');
                  this.unlockDocument('/dashboard', invoice.InvoiceID);
                }
              }
            });
          } else {
            // $location.path('/invoices/' + parseInt(invoice.InvoiceID) + '/edit').
            // search({ status: invoice.InvoiceStatusID, amount: invoice.InvoiceAmount });
            // return false;
          }
        }
      });
  }

  private unlockDocument(linkString, invoiceID): void {

    this.masterService.unlockDocument(invoiceID, 0, 10).then(result => {
      this.router.navigate([linkString]);
    });
  }
  private getInvoiceReject(): void {
    // $scope.errorHeaderRemoveInv = "";
    // $scope.displayValue = 'none';
    // $scope.errorsRemoveInv = [];
  }

  private openInvoiceApproval(invoiceID, Amount, companyID, InvoiceNumber): void {
     if (this.invoiceDetail.InvoiceID == 0) {
      this.docType = 5;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.AttachmentID;
    } else {
      this.docType = 10;
      this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
      this.DocumentID = this.invoiceDetail.InvoiceID;
    }

    this.errorsInv = [];
    this.errorHeader = "";
    this.aprovalComment = null;
    this.openApproveinvoiceModal(invoiceID, Amount, companyID, this.aprovalComment);
  }
  openApproveinvoiceModal(invoiceID, Amount, companyID, aprovalComment) {

    const builder = new BSModalContextBuilder<InvoiceModelContext>(
      {
        invoiceID: invoiceID,
        companyID: companyID,
        invoiceAmount: Amount,
        aprovalComment: aprovalComment,
        DocumentLockingID: this.DocumentLockingID,
        docType: this.docType,
        DocumentID: this.DocumentID,
      } as any,
      undefined,
      InvoiceModelContext
    );

    let overlayConfig: OverlayConfig = {
       context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceApproveModalComponent, overlayConfig)
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
        this.unlockDocument(result.StateUrl,result.InvoiceID);
        }
      }, () => console.log(' Error In aprrovals  modal '));
    });
  }
  private getNextInvoice(invoiceID): void {
    this.InvoiceID = invoiceID;
    this.router.navigate(['/invoice/detail' + invoiceID]);
  }

}
