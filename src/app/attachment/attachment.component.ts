import { Component, OnInit } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../base.component';
import { UserService } from '../user/shared/user.service';
import { AttachmentObject } from '../attachment/shared/attachment.model';
import { AttachmentService } from '../attachment/shared/attachment.service';
import { Modal } from 'angular2-modal/plugins/bootstrap';


import { AccountService } from '../account/shared/account.service';

import {CurrentPageArguments} from '../pagination/pagination.component';

import { AccountModel } from '../account/shared/account.model';
import { CrumbBarComponent } from '../shared/others/crumb-bar/crumb-bar.component';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
	selector: 'attachment',
	templateUrl: 'attachment.component.html'
})

export class AttachmentComponent extends BaseComponent implements OnInit {
	private model: Array<AttachmentObject>;
	private account: AccountModel;
	private companyID: number = 0;
	private pageNumber: number = 1;
	private rowsPerPage: number = 25;
	private status: string = 'all';
	private AttachmentCount:number = 0;
	
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private attachmentService: AttachmentService,
		private accountService: AccountService,
		localStorageService: LocalStorageService,
		router: Router, public modal: Modal) {
		super(localStorageService, router);
        this.model = new Array<AttachmentObject>();
        this.account = new AccountModel();

	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
			this.getAttachments();
			this.getAccountName();
		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}


	private getAttachments(): void {
		this.attachmentService
			.getAttachments(this.companyID, this.status, this.pageNumber, this.rowsPerPage)
			.then(result => {
				if (result) {
                    this.model = result;
                    this.AttachmentCount = this.model[0].AttachmentCount;
                }

			});

	}
	CreateModal() {
		this.modal.alert()
			.size('lg')
			.isBlocking(true)
			.showClose(true)
			.keyboard(27)
			.title('Hello World')
			.body('A Customized Modal')
			.open();
	}
	private getAccountName(): void {
		this.accountService
			.getAccountName()
			.then(result => {
				if (result) {
                    this.account = result;
                }

			});

	}
 

}


