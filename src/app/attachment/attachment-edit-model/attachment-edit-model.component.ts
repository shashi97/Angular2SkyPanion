import { Component, Pipe, OnInit, ViewChildren, QueryList} from '@angular/core';
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
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { AttachmentObject, attachmentdata } from '../../attachment/shared/attachment.model';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../shared/pipe/orderby.ts';


export class AttachmentEditModalContext extends BSModalContext {
	Row;
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-attachment-edit-model',
	templateUrl: 'attachment-edit-model.component.html'
})
export class AttachmentEditComponent extends BaseComponent implements CloseGuard, ModalComponent<AttachmentEditModalContext>, OnInit {
	// export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
	context: AttachmentEditModalContext;
	public wrongAnswer: boolean;
	private CompanyID: number = 0;
	private vendors: Array<Vendors>;
	private attachmentObject:attachmentdata;
	// @ViewChild('templateRef') public templateRef: TemplateRef<any>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,

		private invoiceEntryService: InvoiceEntryService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<AttachmentEditModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		this.attachmentObject = this.context.Row;
		dialog.setCloseGuard(this);
		this.vendors = new Array<Vendors>();


	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
			//this.getVendors();
			// this.getAccountName();

		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}



	GetSelectedVendor(VendorID): void {
		this.dialog.close(VendorID);

	}

	closeModal(): void {
		this.dialog.close();
	}
}


