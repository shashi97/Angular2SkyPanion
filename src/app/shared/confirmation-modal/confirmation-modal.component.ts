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


export class  confirmationModalContext extends BSModalContext {
  header;
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-confirmation-modal',
	templateUrl: 'confirmation-modal.component.html'
})
export class confirmationModalComponent extends BaseComponent implements CloseGuard, ModalComponent<confirmationModalContext>, OnInit {
	// export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
	context: confirmationModalContext;
	public wrongAnswer: boolean;
	private CompanyID: number = 0;
	private vendors: Array<Vendors>;
  private header:string ="";
	// @ViewChild('templateRef') public templateRef: TemplateRef<any>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<confirmationModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
    this.header = this.context.header;
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


