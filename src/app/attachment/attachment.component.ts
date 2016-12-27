import { Component, OnInit, Pipe, ViewContainerRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
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
  private attachmentObject: attachmentdata;
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
    router: Router, public modal: Modal) {
    super(localStorageService, router);
    this.model = new Array<AttachmentObject>();
    this.account = new AccountModel();
    this.searchParameters = null;
    this.companies = new Array<CompanyModel>();
    this.attachmentObject = new attachmentdata();
  }
  ngOnInit() {
    this.sessionDetails = this.userService.getSessionDetails();
    this.activatedRoute.params.subscribe(params => {
      this.pageSizeFilter = +params['pageSizeFilter'];
      this.searchParameters = +params['SearchParameters' ? 'SearchParameters' : -1];
    });
    if (this.sessionDetails.userId != null) {
      this.getAttachments();
      this.getAccountName();
      this.getCompanies();
    } else {
      let link = ['/login'];
      this.router.navigate([link]);
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
          if (result) {
            //}
            // else if (result.status == 500) {
            //     messageService.showMsgBox("error", result.data.ExceptionMessage, "error");
            //     $scope.getAttachments();
            // }
            //else {
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
    this.companiesService.getCompanyDDOs().then(result => {
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


  private editAttachment(row) {
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
          rejectionMemo: row.RejectionMemo
        };


        this.companies.forEach(item => {
          if (item.CompanyID == this.attachmentObject.companyID) {
            this.selectedCompany.selected = item;
            this.newCompanyID = item.CompanyID;
            //this.newCompanyNumber = item.Number;
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
        // doctype: this.doctype,
        // DocumentID: this.DocumentID,
        // attachmentId: this.attachmentId,
        // pageSizeFilter: this.pageSizeFilter,
        // searchParameters: this.searchParameters
      } as any,
      undefined,
      AttachmentEditModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.toJSON()
    };

    const dialog = this.modal.open(AttachmentEditComponent, overlayConfig)
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result == true) {
          this.unlockDocument(result);
        }
      }, () => console.log(' Error In Attachment Edit modal '));
    });
  }

  // const dialog = this.modal.open(SyncModelComponent, overlayConfig);
  //     dialog.then((resultPromise) => {
  //             return resultPromise.result.then((result) => {
  //             // alert(result.status);
  //                if (result.status === true) {
  //                     this.invoceRemoved.emit(result);
  //                 }
  //             }, () => console.log(' Error In invoice modal '));
  //         });
  //         // return this.modal.open(SyncModelComponent, overlayConfig)
  //         //     .catch(err => alert('ERROR'))
  //         //     .then(dialog => dialog.result)
  //         //     .then(result => {
  //         //         if (result.status === true) {
  //         //             this.invoceRemoved.emit(result);
  //         //         }
  //         //     });

}


