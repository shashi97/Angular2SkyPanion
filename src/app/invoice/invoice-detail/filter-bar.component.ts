import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';

import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { InvoiceModel,InvApprovals } from '../shared/invoice.model';
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
@Component({
  selector: 'sp-invoice-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceDetailFilterComponent extends BaseComponent implements OnInit {
 @Input()  invApprovals: InvApprovals;
  @Input() invoiceDetail: InvoiceModel;
  private searchParameters;
  private InvoiceIDs;
  private invoiceIDs = {
    CurrentInvoiceID: '',
    NextInvoiceID: '',
    PreviousInvoiceID: ''
  };
  private invSearchObject: invSearchObject;
  private attachmentId;
  private InvoiceID;
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private invoiceService: InvoiceService,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
    this.searchParameters = -1;
    this.invSearchObject = new invSearchObject();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      //this.attachmentId = +params['attachmentId']; // (+) converts string 'id' to a number
      this.invSearchObject.invoiceID = +params['InvoiceID'];
      this.invSearchObject.companyID = +params['company'];
      this.invSearchObject.invoiceNumber = params['invoiceNumber'];
      this.invSearchObject.statusID = params['status'];
      this.invSearchObject.userID = +params['user'];
      this.invSearchObject.vendorID = +params['vendor'];
      this.getInvoiceID();
    });
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

  private getInvoiceDetailsByID(): void {
    this.masterService.checkDocumentLocking(this.invoiceDetail.InvoiceID, 10).then(result => {
      if (result.IsLocked === 0) {
        this.toastr.error('This Invoice is locked by' + result.LockBy, 'Oops!');
        return;
      } else {
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
      context: builder.toJSON()
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

  private SubmitInvoiceForApproval(invoice): void {
    let documentLockingId: number = 0;
    let docType: string = '';
    let documentId: number = 0;
    if (this.invApprovals != undefined && this.invApprovals.InvoiceApprovals != undefined && this.invApprovals.InvoiceApprovals.length > 0) {
      this.masterService.checkLockedDocumentState(documentLockingId, docType, documentId)
        .then(result => {
          if (result.IsLocked === 0) {
            // messageService.showMsgBox("error", "This invoice is locked by " + result.data.LockBy, "error");
            return;
          } else {
            if (invoice.InvoiceAmount !== 0.00 && invoice.InvoiceAmount !== 0) {
              this.invoiceService.submitInvoiceForApproval(invoice.InvoiceID).then(function (response) {
                if (response.Status === 500) {
                } else {
                  this.toastr.success('Invoice submit for approval successfully', 'Success!');
                  // messageService.showMsgBox("Success", "Invoice submit for approval successfully", "success");
                  // $location.path('/dashboard');
                }
              });
            } else {
              // $location.path('/invoices/' + parseInt(invoice.InvoiceID) + '/edit').search
              // ({ status: invoice.InvoiceStatusID, amount: invoice.InvoiceAmount });
              // return;
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
    let documentLockingId: number = 0;
    let docType: string = '';
    let documentId: number = 0;

    this.masterService.checkLockedDocumentState(documentLockingId, docType, documentId)
      .then(result => {
        if (result.data.IsLocked === 0) {
          this.toastr.error('This invoice is locked by' + result.LockBy, 'Oops!');
          // messageService.showMsgBox("error", "This invoice is locked by " + result.data.LockBy, "error");
          return;
        } else {
          if (invoice.InvoiceAmount > 0) {
            this.invoiceService.submitInvoiceExpedite(invoice.InvoiceID).then(function (response) {
              if (response.Status === 500) {
              } else {
                this.toastr.success('Invoice expedited successfully', 'Success!');
                // messageService.showMsgBox("Success", "Invoice expedited successfully", "success");
                // $location.path('/dashboard');
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

  private getInvoiceReject(): void {
    // $scope.errorHeaderRemoveInv = "";
    // $scope.displayValue = 'none';
    // $scope.errorsRemoveInv = [];
  }

  private openInvoiceApproval(invoiceID, Amount, companyID, InvoiceNumber): void {
    // $scope.invoiceID = invoiceID;
    // $scope.companyID = companyID
    // $scope.errorsInv = [];
    // $scope.errorHeader = "";
    // $scope.aprovalComment = null;
    // $scope.InvAmount = Amount;
    // $scope.InvoiceNumber = InvoiceNumber;
  }

  private getNextInvoice(invoiceID): void {
    // $scope.invoiceID = invoiceID;
    // $location.path('/invoices/' + invoiceID + '/' + encodeURIComponent($scope.invoiceNumber) 
    // + '/' + $scope.vendorID + '/' + $scope.companyID + '/' + $scope.statusID + '/' + $scope.userID);
  }

}
