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
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';


export class InvoiceEntryUnlockNotificationModelContext extends BSModalContext {
	unlockedBy;
	constructor() {
		super();
	}
}




@Component({
	selector: 'sp-invoice-entry-unlockInvoiceNotification',
	templateUrl: 'invoice-entry-unlockNotification.component.html'
})
export class InvoiceEntryUnlockNotificationContext extends BaseComponent implements CloseGuard, ModalComponent<InvoiceEntryUnlockNotificationModelContext>, OnInit {
	context: InvoiceEntryUnlockNotificationModelContext;
    private unlockedBy;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private invoiceEntryService: InvoiceEntryService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<InvoiceEntryUnlockNotificationModelContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
        this.unlockedBy = this.context.unlockedBy;
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


	closeModal(): void {
		this.dialog.close();
	}
}


