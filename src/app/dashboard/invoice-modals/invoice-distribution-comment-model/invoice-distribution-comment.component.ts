import { Component, Pipe, OnInit, ViewChildren, QueryList} from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../../base.component';
import { MasterService } from '../../../shared/services/master/master.service';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../../shared/pipe/orderby.ts';
import { InvoiceService } from '../../../invoice/shared/invoice.service';
import { UserService } from '../../../user/shared/user.service';
import { InvoiceDistributionModelContext } from '../../shared/invoice-distribution-context.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
	selector: 'sp-invoice-distribution-comment-modal',
	templateUrl: 'invoice-distribution-comment.component.html'
})

export class InvoiceDistributionCommentModalComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceDistributionModelContext>, OnInit {
    context: InvoiceDistributionModelContext;
    private errorsRemoveInv;
	private distributionComment;
    private errorHeaderRemoveInv;
	private showHideErrorLog;
    private invoiceID;
    private companyID;
    private distributionID;
    private invoiceAmount;
    private invoiceNumber;
    private displayValue;
    private isCommentDone;

    constructor(private activatedRoute: ActivatedRoute,
    	private userService: UserService,
		localStorageService: LocalStorageService,
		router: Router,
		private invoiceService: InvoiceService,
		private masterService: MasterService,
		public toastr: ToastsManager,
		public dialog: DialogRef<InvoiceDistributionModelContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		this.invoiceID=this.context.invoiceID;
	    this.companyID=this.context.invCompanyID;
        this.distributionID=this.context.invDistributionID;
        this.isCommentDone = false;
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

    private saveDistributionComment(): void {
        	this.errorsRemoveInv = [];
				this.errorHeaderRemoveInv = '';

				if (this.distributionComment == "" || this.distributionComment == null) {
					var obj = { ErrorName: "comment are required to update this distribution" }
					this.errorsRemoveInv.splice(this.errorsRemoveInv.length, 0, obj);
				}

                if (this.errorsRemoveInv.length > 0) {
					this.showHideErrorLog = { 'display': 'block' };
					this.displayValue = 'block';
					this.errorHeaderRemoveInv = this.errorsRemoveInv.length + 'error prevented this distribution from being update:';
				}
				if (this.errorsRemoveInv.length == 0) {

					this.showHideErrorLog = { 'display': 'none' };
					this.displayValue = 'block';

              this.invoiceService.saveDistributionComment(this.distributionID , this.distributionComment).then(result => {
                if (result.Status == 500) {
                }
                else {
                    this.distributionComment = null;
					 this.toastr.success('Distribution comment saved successfully', 'Success!');                            
                        this.dialog.close(this.isCommentDone);
                }
            });
         }
    }

    closeModal(): void {
		this.dialog.close();

	}
}