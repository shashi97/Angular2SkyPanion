import { Component, OnInit } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../base.component';
import { UserService } from '../user/shared/user.service';
import { AttachmentObject } from '../attachment/shared/attachment.model';
import { AttachmentService } from '../attachment/shared/attachment.service';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { MasterService } from '../shared/services/master/master.service';
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
	private AttachmentCount: number = 0;
	private AttachmentID: number = 0;
	private pageSizeFilter: number = 25;
	private DocumentLockingID;
	private searchParameters;
	private LockIntervalTime;

	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private attachmentService: AttachmentService,
		private accountService: AccountService,
		localStorageService: LocalStorageService,
		private masterService: MasterService,
		router: Router, public modal: Modal) {
		super(localStorageService, router);
        this.model = new Array<AttachmentObject>();
        this.account = new AccountModel();
		this.searchParameters = null;

	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		this.activatedRoute.params.subscribe(params => {
			this.pageSizeFilter = +params['pageSizeFilter'];
			this.searchParameters = +params['SearchParameters' ? 'SearchParameters' : -1];
		});
		if (this.sessionDetails.userId != null) {
			this.getAttachments();
			//this.getAccountName();
		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
		if (this.pageSizeFilter == -1) {
            this.pageSizeFilter = 25;
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
	private GetAttachmentDetails(AttachmentID): void {
		this.AttachmentID = AttachmentID;
		this.masterService.checkDocumentLocking(AttachmentID, 5).then(result => {
			if (result.IsLocked == 0) {
				alert("This attachment is locked by " + result.LockBy);
				return;
			} else {
				this.router.navigate(['/invoices/' + this.pageSizeFilter + "/" + this.searchParameters + '/' + '0/new/' + AttachmentID]);
				this.DocumentLockingID = result.DocumentsLockingID;
				this.LockIntervalTime = result.LockIntervalTime;
			}

		});
	}
    
	 private unlockDocumentByAdmin (attachemntID):void {
           this.masterService.unlockDocument(attachemntID, this.sessionDetails.userId, 5).then(result=> {
                if (result) {
                    alert("Attachment unlock successfully");
                    this.getAttachments();
                }


            });
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


