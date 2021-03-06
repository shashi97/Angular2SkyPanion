import { Component, OnInit, Pipe, ViewContainerRef, Input, OnChanges, Output, EventEmitter, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../base.component';
import { UserService } from '../user/shared/user.service';
import { AttachmentObject, attachmentdata } from '../attachment/shared/attachment.model';
import { AttachmentService } from '../attachment/shared/attachment.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AttachmentEditModalContext, AttachmentEditComponent } from '../attachment/attachment-edit-model/attachment-edit-model.component';
import { MasterService } from '../shared/services/master/master.service';
import { AccountService } from '../account/shared/account.service';
import { CompanyService } from '../companies/shared/company.service';
import { CurrentPageArguments } from '../pagination/pagination.component';
import { CompanyModel } from '../companies/shared/company.model';
import { AccountModel } from '../account/shared/account.model';
import { CrumbBarComponent } from '../shared/others/crumb-bar/crumb-bar.component';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { BrowserModule } from '@angular/platform-browser';
import { CompanyDropdownComponent, CompanyFilterArguments } from '../shared/dropdown/company/company-dropdown.component';
import {PubSubService} from '../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../shared/loading-spinner/loading-spinner.component';


// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

export class AttachmentFilterArguments {
  companyId: number = 0;
    pageNo: number= 1;
    toPage: number = 0;
    fromPage: number = 0;
    pageSizeFilter: number = 25;
    isShowPage: boolean = false;
    validatePageSize: boolean = false;
    validateTotalItems: boolean = false;
}

@Component({
  selector: 'attachment',
  templateUrl: 'attachment.component.html'
})

export class AttachmentComponent extends BaseComponent implements OnInit, OnChanges {
  @Output() filtered: EventEmitter<AttachmentFilterArguments> = new EventEmitter<AttachmentFilterArguments>();
  @Input() filteredValue: AttachmentFilterArguments = new AttachmentFilterArguments();
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
  private _currentPage: CurrentPageArguments = new CurrentPageArguments();
  private attachments: Array<AttachmentObject>;
  private sorting: any = {
    column: 'AttachmentID', //to match the variable of one of the columns
    descending: false
  };
  private account: AccountModel;
  private pageName: string = 'attachments';
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
  private attachmentObject: attachmentdata;
  private showLoader:boolean;
  private companies: Array<CompanyModel>;
  private selectedCompany = {
    selected: {}
  }
  private newCompanyID;
  private newCompanyNumber;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private attachmentService: AttachmentService,
    private accountService: AccountService,
    public toastr: ToastsManager,
    private companiesService: CompanyService,
    localStorageService: LocalStorageService,
    private masterService: MasterService,
    overlay: Overlay, vcRef: ViewContainerRef,
    public pubsub: PubSubService,
    router: Router, public modal: Modal) {
    super(localStorageService, router);
    overlay.defaultViewContainer = vcRef;
    this.attachments = new Array<AttachmentObject>();
    this.account = new AccountModel();
    this.searchParameters = null;
    this.companies = new Array<CompanyModel>();
    this.attachmentObject = new attachmentdata();
  }
  ngOnInit() {
	   this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
    
    this.sessionDetails = this.userService.getSessionDetails();
    this.activatedRoute.params.subscribe(params => {
      this.pageSizeFilter = +params['pageSizeFilter'];
      this.searchParameters = +params['SearchParameters' ? 'SearchParameters' : -1];
    });
    if (this.sessionDetails.userId != null) {
      this.getAccountName();
      this.getCompanies();
      this.getAttachments();
    } else {
      let link = ['/login'];
      this.router.navigate([link]);
    }
    if (this.pageSizeFilter == -1) {
      this.pageSizeFilter = 25;
    }

  
  }
  ngOnChanges() {
    //this.companyFilteredArg = this.filteredValue;
  }
    private get currentPageFiltered(): CurrentPageArguments {
    return this._currentPage;
  }

  private set currentPageFiltered(newValue: CurrentPageArguments) {
    this._currentPage = newValue;
    this.getAttachments();
  }
  private get companyFilteredArg(): CompanyFilterArguments {
    return this._companyFilteredValue;
  }

  private set companyFilteredArg(newValue: CompanyFilterArguments) {
    this._companyFilteredValue = newValue;
  }

  public onCurrentPageChanged(newValue: AttachmentFilterArguments) {
    this.currentPageFiltered = newValue;
  }
  private searchUrlReset(): void {
    this.filteredValue.companyId = 0;
    let companyArray = { companyId: 0 };
    this.companyFilteredArg = companyArray;
    this.filtered.emit(this.filteredValue);
    this.getAttachments();

  }
  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.filteredValue.companyId = filteredValue.companyId;

  }
  private searchURL(): void {
    this.getAttachments();

  }
  private getAttachments() {
  return new Promise((resolve, reject) => {
    this.attachmentService
      .getAttachments(this.filteredValue.companyId, this.status, this.currentPageFiltered.pageNo, this.currentPageFiltered.pageSizeFilter)
      .then(result => {
        if (result) {
          this.attachments = result;
          if (this.attachments.length == 0) {
            this.AttachmentCount = 0;
          } else {
            this.AttachmentCount = this.attachments[0].AttachmentCount;
          }
        }
      });
  });
  }

  private GetAttachmentDetails(AttachmentID): void {
    this.AttachmentID = AttachmentID;
    this.masterService.checkDocumentLocking(AttachmentID, 5).then(result => {
      if (result.IsLocked == 0) {
        this.toastr.error("This attachment is locked by " + result.LockBy);
        return;
      } else {
        this.router.navigate(['/invoices/' + this.pageSizeFilter + "/" + this.searchParameters + '/' + '0/new/' + AttachmentID]);
        this.DocumentLockingID = result.DocumentsLockingID;
        this.LockIntervalTime = result.LockIntervalTime;
      }

    });
  }

  private unlockDocumentByAdmin(attachemntID): void {
    this.masterService.unlockDocument(attachemntID, this.sessionDetails.userId, 5).then(result => {
      if (result) {
        this.toastr.success("Attachment unlock successfully");
        this.getAttachments();
      }


    });
  }

  private deleteAttachement(attachemntID): void {
    this.masterService.checkDocumentLocking(attachemntID, 5).then(result => {
      if (result.IsLocked == 0) {
        this.toastr.error("This attachment is locked by " + result.data.LockBy);
        return;
      } else {
        this.attachmentService.deleteAttachement(attachemntID).then(result => {
          if (result.status == 404) {
          }
          else if (result.status == 500) {
            this.toastr.error("error", result.data.ExceptionMessage, "error");
            this.getAttachments();
          }
          else {
            this.toastr.success('Attachment has been deleted successfully');
            this.unlockDocument(attachemntID);
          }

        });
      }

    });
  }

  private unlockDocument(attachemntID): void {
    this.masterService.unlockDocument(attachemntID, this.sessionDetails.userId, 5).then(result => {
      if (result) {
        //}
        //else {

        this.getAttachments();
      }
    });
  }


  private GetInvoiceDetails(AttachedToID): void {
    //this.router.navigate[('/invoices/' + AttachedToID).search({ invoiceNumber: 0, vendor: 0, company: 0, status: 0, user: 0 })];
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

  private getCompanies() {
    this.companiesService.getCompanyDDOs(true).then(result => {
      if (result) {
        this.companies = result;

        var obj = { CompanyID: 0, Number: 'All Companies', CompanyName: 'All Companies', Type: 'None', AccountID: 0 };

        // this.companies.splice(0, 0, obj);
        // this.selectedCompany.selected = obj;
        // this.selectedCompanyFilter.selected = obj;

        // this.companies.forEach(function (item) {
        // 	if (item.CompanyID ==this.companyID) {
        // 		this.selectedCompanyFilter.selected = item;
        // 	}
        // });

      }
      this.getAttachments();

    });
  }




  
  private openEditDialog(row) {
    this.masterService.checkDocumentLocking(row.AttachmentID, 5).then(result => {
      if (result.IsLocked == 0) {
        this.toastr.error("This Invoice is locked by " + result.LockBy);
        return;
      } else {

        // var elementText1 = angular.element('#dgEditAttachment');
        // elementText1.modal("show");
        this.attachmentObject = {
          status: row.Info,
          type: row.type,
          companyName: row.CompanyNameOnly,
          attachmentID: row.AttachmentID,
          accountID: row.account_id,
          uploaded: row.Uploaded,
          fileName: row.Filename,
          companyID: row.CompanyID,
          companyNumber: row.CompanyNumber,
          rejectionMemo: row.RejectionMemo,
          IsGeneralPdf :row.IsGeneralPdf,
          IsFund:row.IsFund
        };


        this.companies.forEach(item => {
          if (item.CompanyID == this.attachmentObject.companyID) {
            this.selectedCompany.selected = item;
            this.newCompanyID = item.CompanyID;
          }
        });

        this.openAttachmentEditModal(this.attachmentObject);

      }
    });
  }


  private openAttachmentEditModal(row) {
    const builder = new BSModalContextBuilder<AttachmentEditModalContext>(
      {
        Row: row
      } as any,
      undefined,
      AttachmentEditModalContext
    );

    let overlayConfig: OverlayConfig = {
        context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(AttachmentEditComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result) {
          this.unlockDocument(result);
        }
      }, () => console.log(' Error In Attachment Edit modal '));
    });
  }

 convertSorting() {
    return this.sorting.descending ? '-' + this.sorting.column : this.sorting.column;
  }

  selectedClass(columnName) {
    return columnName == this.sorting.column ? 'sort-' + this.sorting.descending : false;
  }

  changeSorting(columnName): void {
    var sort = this.sorting;
    if (sort.column == columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
  }

}


