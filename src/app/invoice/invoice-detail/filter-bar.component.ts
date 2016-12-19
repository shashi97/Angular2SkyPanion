import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';

import { MasterService } from '../../shared/services/master/master.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'sp-invoice-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class InvoiceDetailFilterComponent extends BaseComponent implements OnInit {

  @Input() invoiceDetail: InvoiceModel;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private masterService: MasterService,
    private invoiceService: InvoiceService,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private getInvoiceDetailsByID(): void {
    this.masterService.checkDocumentLocking(this.invoiceDetail.InvoiceID, 10).then(result => {
      if (result.IsLocked === 0) {
        this.toastr.error('This Invoice is locked by' + result.LockBy, 'Oops!');
        return;
      } else {
        // $location.path('/invoices/'+$scope.searchParameters +'/'+ parseInt($scope.invoiceDetail.InvoiceID) 
        // + '/edit').search({ status: $scope.invoiceDetail.InvoiceStatusID, amount: $scope.invoiceDetail.InvoiceAmount });
      }
    });
  }


  private SubmitInvoiceForApproval(invoice): void {
    let documentLockingId: number = 0;
    let docType: string = '';
    let documentId: number = 0;

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
