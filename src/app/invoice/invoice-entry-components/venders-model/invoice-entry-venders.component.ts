import { Component, OnInit } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';
import {CurrentPageArguments} from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
	selector: 'sp-invoice-entry-venders',
	templateUrl: 'invoice-entry-venders.component.html'
})

export class InvoiceEntryVendersComponent extends BaseComponent implements OnInit {

	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		localStorageService: LocalStorageService,
		router: Router) {
		super(localStorageService, router);

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


	// private getAttachments(): void {
	// 	this.attachmentService
	// 		.getAttachments(this.companyID, this.status, this.pageNumber, this.rowsPerPage)
	// 		.then(result => {
	// 			if (result) {
    //                 this.model = result;
    //                 this.AttachmentCount = this.model[0].AttachmentCount;
    //             }

	// 		});

	// }



}


