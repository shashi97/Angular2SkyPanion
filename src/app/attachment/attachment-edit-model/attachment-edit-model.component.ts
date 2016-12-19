import { Component, Pipe, OnChanges, OnInit, ViewChildren, QueryList} from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceEntryService } from '../../invoice/invoice-entry/shared/invoice-entry.service';
import { PurchaseOrder } from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { Vendors, InvoiceDetail } from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { AttachmentService } from '../../attachment/shared/attachment.service';
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { AttachmentObject, attachmentdata } from '../../attachment/shared/attachment.model';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../shared/pipe/orderby.ts';
import { CompanyService } from '../../companies/shared/company.service';
import { CompanyData } from '../../companies/shared/company.model';
export class AttachmentEditModalContext extends BSModalContext {
	Row;
	constructor() {
		super();
	}
}



@Component({
	selector: 'sp-attachment-edit-model',
	templateUrl: 'attachment-edit-model.component.html'
})
export class AttachmentEditComponent extends BaseComponent implements CloseGuard, ModalComponent<AttachmentEditModalContext>, OnInit {
    // export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
    context: AttachmentEditModalContext;
    public wrongAnswer: boolean;
    private CompanyID: number = 0;
    private vendors: Array < Vendors > ;
    private companies: Array < any > ;
    private attachmentObject: attachmentdata;
    private selectedCompany = {
        selected: {}
    }
    //private selectedCompany;
    private selectedCompanyFilter = {
        selected: {}
    }

    private newCompanyID: number = 0;
    private newCompanyNumber;
    // @ViewChild('templateRef') public templateRef: TemplateRef<any>;
    constructor(private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private attachmentService: AttachmentService,
        private invoiceEntryService: InvoiceEntryService,
        localStorageService: LocalStorageService,
        router: Router,
        private companiesService: CompanyService,
        public dialog: DialogRef < AttachmentEditModalContext > ) {
        super(localStorageService, router);
        this.context = dialog.context;
        this.attachmentObject = this.context.Row;
        dialog.setCloseGuard(this);
        this.vendors = new Array < Vendors > ();


    }

    ngOnInit() {
        this.sessionDetails = this.userService.getSessionDetails();
        if (this.sessionDetails.userId != null) {
            this.getCompanies();
            // this.getAccountName();

        } else {
            let link = ['/login'];
            this.router.navigate(link);
        }
    }
    private getCompanies() {
        this.companiesService.getCompanyDDOs().then(result => {
            if (result) {
                this.companies = result;
                let obj = new CompanyData();
                this.companies.splice(0, 0, obj);
                this.selectedCompany.selected = obj;
                this.selectedCompanyFilter.selected = obj;

                let temp = this.companies;
                this.companies = [];

                temp.map((item: any) => {
                    this.companies.push({
                        label: item.CompanyName,
                        value: item
                    });
                });

                this.companies.forEach(item => {
                    if (item.value.CompanyID == this.attachmentObject.companyID) {
                        this.selectedCompany.selected = item.value;

                    }
                });

            }

        });
    }

    private getSelectedCompany(selectedCompany): void {
        this.newCompanyID = selectedCompany.CompanyID;
        this.newCompanyNumber = selectedCompany.Number;
    }

        private updateAttachment() {
        if (this.newCompanyID != 0) {
            if (confirm("Are you sure you'd like to change state of this attachment?") == true) {
                this.attachmentService.changeAttachmentProperty(this.attachmentObject.attachmentID, this.newCompanyID, this.newCompanyNumber, this.attachmentObject.companyNumber, this.attachmentObject.fileName).then(result => {
                    if (result.status == 404) {} else if (result.status == 500) {} else {
                        alert("Attachment status has been changed successfully");
                        this.dialog.close(this.attachmentObject.attachmentID);
                    }

                });


            }
        } else {
            alert("please select any property before update this attachment");
            return;
        }
    }

        GetSelectedVendor(VendorID): void {
        this.dialog.close(VendorID);

    }

        closeModal(): void {
        this.dialog.close();
    }
}


