import { Component, Pipe, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceEntryService } from '../../invoice/invoice-entry/shared/invoice-entry.service';
import { PurchaseOrder } from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { Vendors, InvoiceDetail } from '../../invoice/invoice-entry/shared/invoice-entry.model';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import { MasterService } from '../../shared/services/master/master.service';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { DashboardService } from '../../dashboard/shared/dashboard.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../shared/pipe/orderby';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

export class InvoiceApproveModalContext extends BSModalContext {
  DocumentLockingID;
  docType;
  DocumentID;
  invoiceID;
  companyID;
  invoiceAmount;
  aprovalComment;
  constructor() {
    super();
  }
}



@Component({
  selector: 'sp-invalid-approve-modal',
  templateUrl: 'invalid-approve-modal.component.html'
})
export class InvoiceApproveModalComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceApproveModalContext>, OnInit {
  // export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
  context: InvoiceApproveModalContext;
  public wrongAnswer: boolean;
  private companyID: number = 0;
  private vendors: Array<Vendors>;
  private pageSizeFilter: number = 0;
  private searchParameters: number = 0;
  private attachmentBackLink;
  private invoiceBackLink;
  private errorsRemoveInv;
  private RejectionComment;
  private errorHeaderRemoveInv;
  private showHideErrorLog;
  private displayValue;
  private attachmentID;
  private DocumentLockingID;
  private doctype;
  private DocumentID;
  private attachmentId;
  private invoiceID;
  private invoiceAmount;
  private aprovalComment;
  private ApprovalObject = {
    StateUrl: '',
    InvoiceID: ''
  }

  // @ViewChild('templateRef') public templateRef: TemplateRef<any>;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private invoiceEntryService: InvoiceEntryService,
    localStorageService: LocalStorageService,
    router: Router,
    public toastr: ToastsManager,
    private invoiceService: InvoiceService,
    private masterService: MasterService,
    private dashboardService: DashboardService,
    public dialog: DialogRef<InvoiceApproveModalContext>) {
    super(localStorageService, router);
    this.context = dialog.context;
    this.DocumentLockingID = this.context.DocumentLockingID;
    this.doctype = this.context.docType;
    this.DocumentID = this.context.DocumentID;
    this.invoiceID = this.context.invoiceID
    this.companyID = this.context.companyID
    this.invoiceAmount = this.context.invoiceAmount
    this.aprovalComment = this.context.aprovalComment

    dialog.setCloseGuard(this);
    this.attachmentBackLink = '/attachmentsList/' + this.pageSizeFilter + '/' + this.searchParameters;
    this.invoiceBackLink = '/invoices/' + this.pageSizeFilter + '/' + this.searchParameters;
  }
  ngOnInit() {
    // this.activatedRoute.params.subscribe(params => {
    // 	this.attachmentID = +params['AttachmentID']; // (+) converts string 'id' to a number
    // });
    if (this.user.userId != null) {
      //this.getVendors();
      // this.getAccountName();

    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  private ApproveInvoice(): void {
    this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.doctype, this.DocumentID).then(result => {
      if (result.IsLocked == 0) {
        this.toastr.error("This invoice is locked by" + result.LockBy);
      } else {
        this.dashboardService.ApproveInvoice(this.invoiceID, this.invoiceAmount, this.aprovalComment, this.companyID).then(result => {
          if (result.status == 404) {
          } else if (result.status == 500) {
          }
          else {
            this.toastr.success("Success", "Invoice approved successfully", "success");
            this.invoiceService.getInvoicesForApprovalByUserID(this.user.userId).then(result => {
              if (result.status === 404) {
                this.ApprovalObject.StateUrl = '/dashboard';
                this.ApprovalObject.InvoiceID = this.invoiceID;
                this.dialog.close(this.ApprovalObject);
              } else if (result.status === 500) {
                this.ApprovalObject.StateUrl = '/dashboard';
                this.ApprovalObject.InvoiceID = this.invoiceID;
                this.dialog.close(this.ApprovalObject);
              } else {
                if (result.InvoiceID !== undefined ) {
                  this.ApprovalObject.StateUrl = '/invoice/detail/' + parseInt(result.InvoiceID);
                  this.ApprovalObject.InvoiceID = this.invoiceID;
                  this.dialog.close(this.ApprovalObject);
                } else {
                  this.ApprovalObject.StateUrl = '/dashboard';
                  this.ApprovalObject.InvoiceID = this.invoiceID;
                  this.dialog.close(this.ApprovalObject);
                }
              }
            });
          }
        });
      }

    });
  }
  closeModal(): void {
    this.dialog.close();

  }


}


