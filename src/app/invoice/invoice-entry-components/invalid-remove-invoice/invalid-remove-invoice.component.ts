import { Component, Pipe, OnInit, ViewChildren, QueryList} from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../../base.component';
import { UserService } from '../../../user/shared/user.service';
import { CurrentPageArguments } from '../../../pagination/pagination.component';
import { CrumbBarComponent } from '../../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceEntryService } from '../../../invoice/invoice-entry/shared/invoice-entry.service';
import { PurchaseOrder } from '../../../invoice/invoice-entry/shared/invoice-entry.model';
import { Vendors, InvoiceDetail } from '../../../invoice/invoice-entry/shared/invoice-entry.model';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import { MasterService } from '../../../shared/services/master/master.service';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../../shared/pipe/orderby';
import { InvoiceService } from '../../../invoice/shared/invoice.service';

export class InvoicePdfRejectModalContext extends BSModalContext {
	DocumentLockingID;
	doctype;
	DocumentID;
	attachmentId;
	pageSizeFilter;
	searchParameters;
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-invalid-remove-invoice',
	templateUrl: 'invalid-remove-invoice.component.html'
})
export class InvoicePdfRejectModalComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoicePdfRejectModalContext>, OnInit {
	// export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
	context: InvoicePdfRejectModalContext;
	public wrongAnswer: boolean;
	private CompanyID: number = 0;
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

	// @ViewChild('templateRef') public templateRef: TemplateRef<any>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private invoiceEntryService: InvoiceEntryService,
		localStorageService: LocalStorageService,
		router: Router,
		private invoiceService: InvoiceService,
		private masterService: MasterService,
		public dialog: DialogRef<InvoicePdfRejectModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		this.DocumentLockingID=this.context.DocumentLockingID;
	    this.doctype=this.context.doctype;
	    this.DocumentID=this.context.DocumentID;
	    this.attachmentId=this.context.attachmentId;
	    this.pageSizeFilter=this.context.pageSizeFilter;
	    this.searchParameters=this.context.searchParameters;
		dialog.setCloseGuard(this);
		this.attachmentBackLink = '/attachmentsList/' + this.pageSizeFilter + '/' + this.searchParameters;
        this.invoiceBackLink = '/invoices/' + this.pageSizeFilter + '/' + this.searchParameters;
	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		// this.activatedRoute.params.subscribe(params => {
		// 	this.attachmentID = +params['AttachmentID']; // (+) converts string 'id' to a number
		// });
		if (this.sessionDetails.userId != null) {
			//this.getVendors();
			// this.getAccountName();

		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}


	private InvalidateInvoice(): void {
		this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.doctype, this.DocumentID).then(result => {
			if (result.IsLocked == 0) {
				alert("This invoice is locked by" + result.LockBy);
			} else {

				this.errorsRemoveInv = [];
				this.errorHeaderRemoveInv = '';

				if (this.RejectionComment == "" || this.RejectionComment == null) {
					var obj = { ErrorName: "Rejection Memo Required to invalidate attachment" }
					this.errorsRemoveInv.splice(this.errorHeaderRemoveInv.length, 0, obj);
				}

				if (this.errorsRemoveInv.length > 0) {
					this.showHideErrorLog = { 'display': 'block' };
					this.displayValue = 'block';
					this.errorHeaderRemoveInv = this.errorsRemoveInv.length + 'error prevented this invoice from being rejected:';
				}
				if (this.errorsRemoveInv.length == 0) {
					this.showHideErrorLog = { 'display': 'none' };
					this.displayValue = 'block';
					this.invoiceService.rejectAttachment(this.attachmentId, this.RejectionComment).then(result => {
						alert("Invoice reject successfully");
							this.dialog.close(this.attachmentBackLink);
					});
				}



			}

		});
	}
	closeModal(): void {
		this.dialog.close();

	}


}


