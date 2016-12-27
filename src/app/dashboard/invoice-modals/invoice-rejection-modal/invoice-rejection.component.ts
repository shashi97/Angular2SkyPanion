import { Component, Pipe, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../../base.component';
import { MasterService } from '../../../shared/services/master/master.service';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../../shared/pipe/orderby';
import { InvoiceService } from '../../../invoice/shared/invoice.service';
import { UserService } from '../../../user/shared/user.service';
import { InvoiceModelContext } from '../../shared/invoice-context.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'sp-reject-invoice',
  templateUrl: 'invoice-rejection.component.html'
})

export class InvoiceRejectModalComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceModelContext>, OnInit {
  context: InvoiceModelContext;
  private errorsRemoveInv;
  private rejectionComment;
  private errorHeaderRemoveInv;
  private showHideErrorLog;
  private invoiceID;
  private companyID;
  private invoiceAmount;
  private invoiceNumber;
  private displayValue;
  private isRejected;

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    localStorageService: LocalStorageService,
    router: Router,
    private invoiceService: InvoiceService,
    private masterService: MasterService,
    public toastr: ToastsManager,
    public dialog: DialogRef<InvoiceModelContext>) {
    super(localStorageService, router);
    this.context = dialog.context;
    this.invoiceID = this.context.invoiceID;
    this.companyID = this.context.companyID;
    this.invoiceAmount = this.context.invoiceAmount;
    this.invoiceNumber = this.context.invoiceNumber;
    this.isRejected = false;
    dialog.setCloseGuard(this);
  }


  ngOnInit() {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private rejectInvoice(): void {
    this.errorsRemoveInv = [];
    this.errorHeaderRemoveInv = '';

    if (this.rejectionComment == "" || this.rejectionComment == null) {
      var obj = { ErrorName: "Rejection Memo Required to reject invoice" }
      this.errorsRemoveInv.splice(this.errorsRemoveInv.length, 0, obj);
    }

    if (this.errorsRemoveInv.length > 0) {
      this.showHideErrorLog = { 'display': 'block' };
      this.displayValue = 'block';
      this.errorHeaderRemoveInv = this.errorsRemoveInv.length + 'error prevented this invoice from being rejected:';
    }
    if (this.errorsRemoveInv.length == 0) {

      this.showHideErrorLog = { 'display': 'none' };
      this.displayValue = 'block';

      this.masterService.checkDocumentLocking(this.invoiceID, 10).then(result => {
        if (result.IsLocked == 0) {
          this.toastr.error('This Invoice is locked by' + result.LockBy, 'Oops!');
          this.rejectionComment = '';
          return;
        } else {

          this.invoiceService.rejectInvoice(this.invoiceID, this.companyID, this.invoiceAmount, this.rejectionComment, result.DocumentsLockingID).then(result1 => {
            if (result1.Status == 500) {
            }
            else {
              this.rejectionComment = null;
              this.toastr.success('Invoice Number ' + this.invoiceNumber + '  rejected Successfully', 'Success!');
              this.dialog.close(this.isRejected);
            }
          });
        }
      })
    }
  }

  closeModal(): void {
    this.dialog.close();

  }
}