import { Component, Pipe, OnChanges, OnInit, ViewChildren, QueryList, AfterViewInit, DoCheck, AfterContentInit} from '@angular/core';
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
import { FilterPipe } from '../../shared/pipe/orderby';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CompanyService } from '../../companies/shared/company.service';
import { CompanyData } from '../../companies/shared/company.model';
import {PubSubService} from '../../interceptor/pub-service';
import {
  confirmationModalContext,
  confirmationModalComponent
} from '../../shared/confirmation-modal/confirmation-modal.component';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
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
export class AttachmentEditComponent extends BaseComponent
  implements CloseGuard, ModalComponent<AttachmentEditModalContext>, OnInit, OnChanges, AfterViewInit, DoCheck, AfterContentInit {
  // export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
  context: AttachmentEditModalContext;
  public wrongAnswer: boolean;
  private CompanyID: number = 0;
  private vendors: Array<Vendors>;
  private companies: Array<any>;
  private attachmentObject: attachmentdata;
  private showLoader: boolean;
  private header: string = "";
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
    overlay: Overlay, public modal: Modal,
    public toastr: ToastsManager,
    private companiesService: CompanyService,
    public dialog: DialogRef<AttachmentEditModalContext>,
    public pubsub: PubSubService) {
    super(localStorageService, router);
    this.dialog.context.dialogClass = 'modal-dialogss';
    this.context = dialog.context;
    this.attachmentObject = this.context.Row;
    dialog.setCloseGuard(this);
    this.vendors = new Array<Vendors>();
    this.header = "Are you sure you'd like to change state of this attachment?"
    //this.dialog.context.dialogClass = 'modal-centered';

  }

  ngOnInit() {
    this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
    this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

  ngOnChanges() {
    //       setTimeout(() => {
    //     this.loadModal();
    //  }, 1);
  }



  ngAfterViewInit() {
    setTimeout(() => {
      this.loadModal();
    }, 500);
  }

  ngDoCheck() {
    // this.loadModal();
  }

  ngAfterContentInit() {
    //this.loadModal();
  }

  private loadModal() {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getCompanies();
      // this.getAccountName();

    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  ChangeStateConfirmationModal() {
    const builder = new BSModalContextBuilder<confirmationModalContext>(
      { header: this.header } as any,
      undefined,
      confirmationModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(confirmationModalComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result === "true") {
          this.updateAttachment();
        }
      }, () => console.log(' user canceled logout modal '));
    });


  }
  private getCompanies() {
    if (this.attachmentObject.IsFund) {
      this.getCompanyListFilteredByFundProperties();
    } else {
      this.getAllCompanies();
    }
  }

  private getCompanyListFilteredByFundProperties() {
    this.companiesService.getCompanyListFilteredByFundProperties(this.attachmentObject.companyID).then(result => {
      if (result) {
        this.companies = result;
        let obj = { CompanyID: 0, Number: 'All Companies', CompanyName: 'All Companies', Type: 'None', AccountID: 0 };
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

  private getAllCompanies() {
    this.companiesService.getCompanyDDOs(false).then(result => {
      if (result) {
        this.companies = result;
        let obj = { CompanyID: 0, Number: 'All Companies', CompanyName: 'All Companies', Type: 'None', AccountID: 0 };
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

      this.attachmentService.changeAttachmentProperty(this.attachmentObject.attachmentID, this.newCompanyID, this.newCompanyNumber, this.attachmentObject.companyNumber, this.attachmentObject.fileName).then(result => {
        if (result.status == 404) { } else if (result.status == 500) { } else {
          this.toastr.success("Attachment status has been changed successfully");
          this.dialog.close(this.attachmentObject.attachmentID);
        }

      });
    } else {
      this.toastr.error("please select any property before update this attachment");
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


