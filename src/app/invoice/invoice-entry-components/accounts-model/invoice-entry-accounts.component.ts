import { Component, Pipe, OnInit, ViewChildren, QueryList} from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../../base.component';
import { UserService } from '../../../user/shared/user.service';
import { CurrentPageArguments } from '../../../pagination/pagination.component';
import { CrumbBarComponent } from '../../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceEntryService } from '../../../invoice/invoice-entry/shared/invoice-entry.service';
import { LedgerAccounts } from '../../../invoice/invoice-entry/shared/invoice-entry.model';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';



export class InvoiceEntryAccountModalContext extends BSModalContext {
	constructor() {
		super();
	}
}

@Component({
	selector: 'sp-invoice-entry-accounts',
	templateUrl: 'invoice-entry-accounts.component.html'
})

export class InvoiceEntryAccountsComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceEntryAccountModalContext>, OnInit {
	private ledgerAccounts: Array<LedgerAccounts>
	context: InvoiceEntryAccountModalContext;
	public wrongAnswer: boolean;
	private LedgerAccountsCount;
	private CompanyID: number = 39;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private invoiceEntryService: InvoiceEntryService,
		localStorageService: LocalStorageService,
		router: Router,
		public dialog: DialogRef<InvoiceEntryAccountModalContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		dialog.setCloseGuard(this);
		this.wrongAnswer = true;
		this.getLedgerAccounts();
	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
			// this.getAttachments();
			// this.getAccountName();
		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}


	public getLedgerAccounts(): void {
		this.invoiceEntryService
			.getLedgerAccountDDOsAccountTypeWise(this.CompanyID)
			.then(result => {
				if (result) {
                    this.ledgerAccounts = result;
					this.LedgerAccountsCount = 'Available properties';
                }

			});

	}
	GetSelectedAccountOrder(LedgerAccount): void {
		this.dialog.close(LedgerAccount);

	}




}


