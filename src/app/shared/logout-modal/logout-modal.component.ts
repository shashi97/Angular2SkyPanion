import { Component, Pipe, OnInit, ViewChildren, QueryList} from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';
import { Vendors, InvoiceDetail } from '../../invoice/invoice-entry/shared/invoice-entry.model';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
// import { FilterPipe } from '../../../shared/pipe/orderby.ts';


export class logoutModalContext extends BSModalContext {
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-logout-modal',
	templateUrl: 'logout-modal.component.html'
})
export class logoutComponent extends BaseComponent implements CloseGuard, ModalComponent<logoutModalContext>, OnInit {
	// export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
	context: logoutModalContext;
	public wrongAnswer: boolean;
	private CompanyID: number = 0;
	private vendors: Array<Vendors>;
	// @ViewChild('templateRef') public templateRef: TemplateRef<any>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<logoutModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		dialog.setCloseGuard(this);


	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
		//	this.getVendors();
			// this.getAccountName();

		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}

	closeModal(event): void {
		this.dialog.close(event);
	}
}


