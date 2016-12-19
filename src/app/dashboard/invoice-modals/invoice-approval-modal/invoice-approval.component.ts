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
import { InvoiceModelContext } from '../../shared/invoice-context.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
	selector: 'sp-approval-invoice',
	templateUrl: 'invoice-approval.component.html'
})

export class InvoiceApprovalModalComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceModelContext>, OnInit {
    context: InvoiceModelContext;
    private errorsRemoveInv;
	private aprovalComment;
    private errorHeaderRemoveInv;
	private showHideErrorLog;
    private invoiceID;
    private companyID;
    private invoiceAmount;
    private invoiceNumber;
    private displayValue;
    private isApproved;

    constructor(private activatedRoute: ActivatedRoute,
    	private userService: UserService,
		localStorageService: LocalStorageService,
		router: Router,
		private invoiceService: InvoiceService,
		private masterService: MasterService,
        public toastr: ToastsManager,
		public dialog: DialogRef<InvoiceModelContext>) {
		super(localStorageService, router);
		this.context = dialog.context;
		this.invoiceID=this.context.invoiceID;
	    this.companyID=this.context.companyID;
	    this.invoiceAmount=this.context.invoiceAmount;
        this.invoiceNumber = this.context.invoiceNumber;
        this.isApproved = false;
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

    private aproveInvoice(): void {
                     this.masterService.checkDocumentLocking(this.invoiceID, 10).then(result =>{
                        if (result.IsLocked == 0) {
                                        this.toastr.error('This Invoice is locked by '+ result.LockBy, 'Oops!');
                                        this.aprovalComment ='';
                                        return;
                                } else {

                                   this.invoiceService.approveInvoice(this.invoiceID , this.invoiceAmount, this.aprovalComment,this.companyID).then(result1 => {
                                            if (result1.Status == 500) {
                                            }
                                            else {
                                                this.aprovalComment = null;
                                                this.toastr.success('Invoice number ' + this.invoiceNumber + ' approved successfully', 'Success!');                            
                                                this.dialog.close(this.isApproved);
                                            }
                                        });
                             }
                     })    
            
    }

    closeModal(): void {
		this.dialog.close();

	}
}