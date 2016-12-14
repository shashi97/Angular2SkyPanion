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
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../../shared/pipe/orderby.ts';


export class InvoiceEntryVendorModalContext extends BSModalContext {
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-invoice-entry-vendor',
	templateUrl: 'invoice-entry-vendor.component.html'
})
export class InvoiceEntryVendorComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceEntryVendorModalContext>, OnInit {
	// export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
	context: InvoiceEntryVendorModalContext;
	public wrongAnswer: boolean;
	private CompanyID: number = 0;
	private vendors: Array<Vendors>;
	// @ViewChild('templateRef') public templateRef: TemplateRef<any>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,

		private invoiceEntryService: InvoiceEntryService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<InvoiceEntryVendorModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		dialog.setCloseGuard(this);
		this.vendors = new Array<Vendors>();


	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
			this.getVendors();
			// this.getAccountName();

		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}


	public getVendors(): void {
		this.invoiceEntryService
			.getVendorById(this.CompanyID)
			.then(result => {
				if (result) {
                    this.vendors = result;

                }

			});

	}
	GetSelectedVendor(VendorID): void {
		this.dialog.close(VendorID);

	}

	closeModal(): void {
		this.dialog.close();
	}
}


