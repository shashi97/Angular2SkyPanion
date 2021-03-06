
import { Component, OnInit, ViewContainerRef, AfterViewInit , OnChanges ,ViewChild,OnDestroy } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';
import { InvoiceEntryService } from '../../invoice/invoice-entry/shared/invoice-entry.service';
import { CurrentPageArguments } from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { InvoiceModel } from '../../invoice/shared/invoice.model';
import {
  InvoiceDetail, invSearchObject, PurchaseOrder, CompanyData, Vendors,
  LedgerAccounts, GlAccountObject, InvoiceExistItems, JobCategory, InvApprovals
} from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { JobModel } from '../../job/shared/job.model';
import { UserModel } from '../../user/shared/user.model';
import { JobsService } from '../../job/shared//jobs.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { ApiUrl } from '../../config.component';
import * as moment from 'moment';
import { CompanyModel } from '../../companies/shared/company.model';
import { CompanyService } from '../../companies/shared/company.service';
import { BrowserModule } from '@angular/platform-browser';
import { MasterService } from '../../shared/services/master/master.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import {
  InvoiceEntryPurchaseModalContext,
  InvoiceEntryPurchaseComponent
} from '../../invoice/invoice-entry-components/purchase-model/invoice-entry-purchase.component';
import {
  InvoiceEntryVendorModalContext,
  InvoiceEntryVendorComponent
} from '../../invoice/invoice-entry-components/vendors-model/invoice-entry-vendor.component';
import {
  InvoiceEntryAccountModalContext,
  InvoiceEntryAccountsComponent
} from '../../invoice/invoice-entry-components/accounts-model/invoice-entry-accounts.component';
import {
  InvoicePdfRejectModalContext,
  InvoicePdfRejectModalComponent
} from '../../invoice/invoice-entry-components/invalid-remove-invoice/invalid-remove-invoice.component';
import {
  InvoiceEntryNoApproverExistsModalContext,
  InvoiceEntryNoApproverExistsComponent
} from '../../invoice/invoice-entry-components/noApproverExists-model/invoice-entry-noApproverExists.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { InvoiceModelContext  } from '../../dashboard/shared/invoice-context.model';
import { InvoiceRejectModalComponent } from '../../dashboard/invoice-modals/invoice-rejection-modal/invoice-rejection.component';
import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';
declare let jQuery: any;
import { FocusMe } from '../../shared/directive/showOnRowHover';

import { OrderByPipe, CurrencyPipe } from '../../shared/pipe/orderby';
import { CurrencyFormatterDirective } from '../../shared/directive/showOnRowHover';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import {
  InvoiceEntryUnlockNotificationModelContext ,
  InvoiceEntryUnlockNotificationContext
} from '../../invoice/invoice-entry-components/invoiceUnlockedNotifciation-model/invoice-entry-unlockNotification.component';


@Component({
  selector: 'sp-invoice-entry',
  templateUrl: 'invoice-entry.component.html',
  styleUrls: ['../invoice-entry/css/invoice-entry.css'],
  providers: [FocusMe, CurrencyPipe,
    CurrencyFormatterDirective]
  // host: {
  //   '(document:click)': 'this.inputFocused = false',
  // },

})

export class InvoiceEntryComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  private _companyFilteredValue: CompanyFilterArguments = new CompanyFilterArguments();
  private lockTimer;
  private lockUserName:string = '';
  private fundCompanyID: number = 0;
  private accountCompanyID: number = 0;
  private fundCompanyNumber: string = '';
  private attachmentId: number = 0;
  private invoiceID: number = 0;
  private InvoiceID: number = 0;
  private isAddAccount;
  private CompanyID: number = 0;
  private IsAcc1show;
  private IsAcc2show;
  private IsAcc3show;
  private IsAcc4show;
  private roleExistCount: number = 0;
  private docType: number = 0;
  private DocumentLockingID: number = 0;
  private DocumentID: number = 0;
  private vendorKey;
  private cashAccount;
  private Accountbind;
  private invSearchObject: invSearchObject;
  private vendors: Array<any>;
  private jobs: Array<any>;
  private invApprovals: InvApprovals;
  private companies: Array<any>;
  private fundCompanies: Array<any>;
  private date: moment.Moment;
  private selectedJob = {
    selected: []
  }
  private selectedJobCategory = {
    selected: {
    }
  }
  private selectedPaymentMethod = {
    selected: {}
  }
  private selectedCompany = {
    selected: {}

  }
  private selectedFundCompany = {
    selected: {}

  }
  private companyData: CompanyData;
  private errors;
  private displayValue: string = '';
  private errorHeader;
  private pdfsrc1;
  private pdfsrc;
  private invoiceAlert;
  private glAccountObject: GlAccountObject;
  private dueDays: number = 0;
  private achAcctName = '';
  private AccountNumber: string = '';
  private invoiceDate: string = '';
  private dueDate: string = '';
  private postGlDate: string = '';
  private dashboardBackLink:string = '';
  private poNum;
  private doctype;
  private documentID;
  private NextAttchID;
  private poVendorKey;
  private poInvDesc;
  private documentType;
  private pageSizeFilter;
  private searchParameters;
  private LedgerAccountsCount;
  private invoiceIDs = {
    CurrentInvoiceID: '',
    NextInvoiceID: '',
    PreviousInvoiceID: ''
  };
  private companyTooltip;
  private invoiceBackLink;
  private inputFocusedss = false;
  private fcs_AccountNum;
  private fcs_description;
  private invoiceDetail: InvoiceDetail;
  private oldInvoiceDistributionsJson: string;
  private oldInvoiceAmount: number;
  private oldVendorID: number;
  private purchaseOrders: Array<any>;
  private invoiceNumber;
  private attachmentBackLink;
  private invoiceExistItems: InvoiceExistItems;
  private User: UserModel;
  private companyNumber;
  private jobCategory: Array<any>;
  private ledgerAccounts: Array<any>;
  private paymentMethods: Array<any>;
  private showLoader:boolean;
  private dateFormat:any;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private domSanitizer: DomSanitizer,
    localStorageService: LocalStorageService,
    router: Router,
    public toastr: ToastsManager,
    private jobsService: JobsService,
    private companiesService: CompanyService,
    private masterService: MasterService,
    private invoiceEntryService: InvoiceEntryService,
    private invoiceService: InvoiceService,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.dateFormat = { format: 'MM/DD/YYYY' };
    overlay.defaultViewContainer = vcRef;
    this.invoiceDetail = new InvoiceDetail();
    this.isAddAccount = true;
    this.fcs_AccountNum = false;
    this.glAccountObject = new GlAccountObject();
    this.companyData = new CompanyData();
    // this.purchaseOrders = new Array<PurchaseOrder>();
    this.IsAcc1show = true;
    this.IsAcc2show = true;
    this.IsAcc3show = true;
    this.IsAcc4show = true;
    this.invSearchObject = new invSearchObject();
    this.jobCategory = new Array<any>();
    this.pageSizeFilter = 25;
    this.searchParameters = -1;
    this.attachmentBackLink = '/attachmentsList/' + this.pageSizeFilter + '/' + this.searchParameters;
    this.invoiceBackLink = '/invoice/' + this.pageSizeFilter + '/' + this.searchParameters;
    this.dashboardBackLink = '/dashboard';
    this.ledgerAccounts = [];
  }

  ngOnInit() {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);

    //   jQuery("#Invoice_date").datepicker({
    //   format: "mm/dd/yyyy",
    //   autoclose: true,
    //   onSelect: dateText => {
    //     this.invoiceDate = dateText;
    //      this.setDueDateByInvoiceDate();
    //   }
    // });
    // jQuery("#datetimepicker_invoiceDate").click(function () {
    //   jQuery("#Invoice_date").datepicker("show")
    // });
   
    // jQuery("#Due_date").datepicker({
    //   format: "mm/dd/yyyy",
    //   autoclose: true,
    //   onSelect: dateText => {
    //     this.dueDate = dateText;
       
    //   }
    // });
    // jQuery("#datetimepicker_Duedate").click(function () {
    //   jQuery("#Due_date").datepicker("show");
    // });

    // jQuery("#Gl_date").datepicker({
    //   format: "mm/dd/yyyy",
    //   autoclose: true,
    //   onSelect: dateText => {
    //     this.postGlDate = dateText;
    //   }
    // });
    // jQuery("#datetimepicker_Gldate").click(function () {
    //   jQuery("#Gl_date").datepicker("show");
    // });

  }

  dateClick() {
    console.log('click click!');
  }

  dateChange(date) {
    this.date = date;
  }



  ngAfterViewInit() {
      setTimeout(() => {
          if (this.user.userId != null) {
      this.activatedRoute.params.subscribe(params => {
        this.attachmentId = +params['attachmentId']; // (+) converts string 'id' to a number
        this.InvoiceID = +params['InvoiceID'];
         this.sessionDetails = this.userService.getSessionDetails();
        this.getCompanies();
        this.poNum = ''
        this.invoiceDate = '';
        this.dueDate = '';
        this.postGlDate = '';
      });
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
    }, 500);
    // jQuery('#Invoice_date').datepicker({
    //   dateFormat: 'mm/dd/yy',
    //   onClose: dateText => {
    //     this.invoiceDate = dateText;
    //   }
    // });

    // jQuery('#Due_date').datepicker({
    //   dateFormat: 'mm/dd/yy',
    //   onClose: dateText => {
    //     this.dueDate = dateText;
    //   }
    // });
    // jQuery('#Gl_date').datepicker({
    //   dateFormat: 'mm/dd/yy',
    //   onClose: dateText => {
    //     this.postGlDate = dateText;
    //   }
    // });
  //   jQuery("#Invoice_date").datepicker({
  //     format: "mm/dd/yyyy",
  //     autoclose: true,
  //     onSelect: dateText => {
  //       this.invoiceDate = dateText;
  //        this.setDueDateByInvoiceDate();
  //     }
  //   });
  //   jQuery("#datetimepicker_invoiceDate").click(function () {
  //     jQuery("#Invoice_date").datepicker("show");
  //   });
   
  //   jQuery("#Due_date").datepicker({
  //     format: "mm/dd/yyyy",
  //     autoclose: true,
  //     onSelect: dateText => {
  //       this.dueDate = dateText;
       
  //     }
  //   });
  //   jQuery("#datetimepicker_Duedate").click(function () {
  //     jQuery("#Due_date").datepicker("show");
  //   });

  //   jQuery("#Gl_date").datepicker({
  //     format: "mm/dd/yyyy",
  //     autoclose: true,
  //     onSelect: dateText => {
  //       this.postGlDate = dateText;
  //     }
  //   });
  //   jQuery("#datetimepicker_Gldate").click(function () {
  //     jQuery("#Gl_date").datepicker("show");
  //   });
    }

  public onCompanyFiltered(filteredValue: CompanyFilterArguments): void {
    this.CompanyID = filteredValue.companyId;
    this.companies.forEach(item => {
      if (item.CompanyID == this.CompanyID) {
        this.companyNumber = item.Number;
      }
    });
    this.onCompanyDropperChange(this.CompanyID, this.companyNumber)
  }
  private onCompanyDropperChange(companyID, companyNumber) {

    if (companyID != 0 && companyID != this.invoiceDetail.CompanyID) {
      if (confirm("Are you sure you'd like to change property of this invoice?") == true) {
        this.invoiceService.changeInvoiceProperty(this.invoiceDetail.AttachmentID, this.invoiceDetail.InvoiceID, 
                      this.CompanyID, this.companyNumber, this.invoiceDetail.CompanyNumber, this.invoiceDetail.AttachmentName).then(result => {
          if (result.status == 404) {
          }
          else if (result.status == 500) {
          }
          else {
            this.toastr.success("success", "Property changed for this invoice successfully", "success");
            if (this.invoiceDetail.IsGeneralPdf == true && this.invoiceDetail.InvoiceID == 0) {
              window.location.href = '#/invoices/' + this.pageSizeFilter + '/' + this.searchParameters + '/0/new/' + this.invoiceDetail.AttachmentID;
              window.location.reload();

            } else {
              this.router.navigate(['/invoice/detail/' + this.pageSizeFilter + '/' + this.searchParameters + '/' + this.invoiceDetail.InvoiceID + '/' + this.invoiceDetail.InvoiceNumber + '/' + 0 + '/' + companyID + '/' + null + '/' + null]);
            }
          }

        });
      }
    }
  }


  openRejectInvoiceModal() {

    const builder = new BSModalContextBuilder<InvoiceModelContext>(
      {
        invoiceID: this.InvoiceID,
        companyID: this.invoiceDetail.CompanyID,
        invoiceAmount: this.invoiceDetail.InvoiceAmount,
        invoiceNumber: this.invoiceDetail.InvoiceNumber,
      } as any,
      undefined,
      InvoiceModelContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceRejectModalComponent, overlayConfig)
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && this.invoiceIDs.NextInvoiceID > (this.invoiceDetail.InvoiceID).toString()) {
            this.unlockDocument('/invoices/-1/' + parseInt(this.invoiceIDs.NextInvoiceID) + '/edit');
          } else {
            this.unlockDocument('/dashboard');
          }
        }
      }, () => console.log(' Error In Dashboard invoice modal '));
    });
  }

  openPurchaseModal() {
    const builder = new BSModalContextBuilder<InvoiceEntryPurchaseModalContext>(
      { num1: 2, num2: 3 } as any,
      undefined,
      InvoiceEntryPurchaseModalContext
    );

    let overlayConfig: OverlayConfig = {
     context: builder.isBlocking(false).toJSON()
    };
    const dialog = this.modal.open(InvoiceEntryPurchaseComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          this.GetSelectedPurchaseOrder(result);
        }
      }, () => console.log(' Error In Purchase modal '));
    });


  }

  openNoApproverExistsModal() {
    const builder = new BSModalContextBuilder<InvoiceEntryNoApproverExistsModalContext>(
      { num1: 2, num2: 3 } as any,
      undefined,
      InvoiceEntryNoApproverExistsModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceEntryNoApproverExistsComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          //this.GetSelectedPurchaseOrder(result);
        }
      }, () => console.log(' Error In Purchase modal '));
    });


  }
  openVendorModal() {
    const builder = new BSModalContextBuilder<InvoiceEntryVendorModalContext>(
      { num1: 2, num2: 3 } as any,
      undefined,
      InvoiceEntryVendorModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceEntryVendorComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          this.GetSelectedVendors(result);
        }
      }, () => console.log('Error In Vendor modal'));
    });

  }

  openAccountModal() {
    if (this.invoiceDetail.IsFund) {
      this.accountCompanyID = this.fundCompanyID
    } else {
      this.accountCompanyID = this.invoiceDetail.CompanyID
    }

    const builder = new BSModalContextBuilder<InvoiceEntryAccountModalContext>(
      {
        CompanyID: this.accountCompanyID
      } as any,
      undefined,
      InvoiceEntryAccountModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceEntryAccountsComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          this.addGlAccountByPopup(result);
        }
      }, () => console.log(' Error In Attachment Edit modal '));
    });

  }
  openInvalidatePdfModal() {
    const builder = new BSModalContextBuilder<InvoicePdfRejectModalContext>(
      {
        DocumentLockingID: this.DocumentLockingID,
        doctype: this.doctype,
        DocumentID: this.DocumentID,
        attachmentId: this.attachmentId,
        pageSizeFilter: this.pageSizeFilter,
        searchParameters: this.searchParameters
      } as any,
      undefined,
      InvoicePdfRejectModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoicePdfRejectModalComponent, overlayConfig);

    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
          this.unlockDocument(result);
        }
      }, () => console.log(' Error In Attachment Edit modal '));
    });

  }

  private getCompanies(): void {
    this.companiesService.getCompanyDDOs(false).then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.companies = result;
        let obj = { CompanyID: 0, Number: 'None', CompanyName: 'None', Type: 'None', account_id: 0 };
        // this.companies.splice(0, 0, obj);
        // this.selectedCompany.selected = obj;
      }
      this.getUserDetails();
    });
  }
  private getUserDetails(): void {
    this.userService.getUserById(this.user.userId).then(result => {
      if (result) {
        this.User = result;
        this.getPurchaseOrders();
      }

    });


  }

  private getPurchaseOrders(): void {
    this.invoiceEntryService
      .getPurchaseOrders()
      .then(result => {
        if (result.status == 404) {
        }
        else if (result.status == 500) {
        } else {
          this.purchaseOrders = result;
        }
        this.getPaymentMethod();
      });

  }

  private getPaymentMethod(): void {
    this.paymentMethods = [{ ID: 0, Name: 'Check' }];
    let temp = this.paymentMethods;
    temp.map((item: any) => {
      this.paymentMethods.push({
        label: item.Name,
        value: item
      });
    });
    this.paymentMethods.forEach(item => {
      if (item.ID === 0) {
        this.selectedPaymentMethod.selected = item;
      }
    });

    this.getInvoiceID();
  }

  private getInvoiceID(): void {
    this.invSearchObject.invoiceID = this.InvoiceID

    this.invoiceService.getInvoiceId(this.invSearchObject).then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.invoiceIDs = result;
      }
      this.getInvoiceDetail();
    });
  }

  private getInvoiceDetail() {
    return new Promise((resolve, reject) => {
    this.invoiceEntryService
      .getInvoiceDetail(this.InvoiceID, this.attachmentId).then(result => {
        if (result) {
          this.invoiceDetail = result;
          if (this.invoiceDetail.InvoiceID == 0) {
            this.docType = 5;
            this.DocumentLockingID = this.invoiceDetail.DocumentLockingID;
            this.DocumentID = this.invoiceDetail.AttachmentID;
          } else {
            this.docType = 10;
            this.DocumentLockingID = this.invoiceDetail.DocumentLockingID;
            this.DocumentID = this.invoiceDetail.InvoiceID;
          }

          if (this.invoiceDetail.InvoiceDistributions != undefined && this.invoiceDetail.InvoiceDistributions != []) {
            this.oldInvoiceDistributionsJson = (JSON.stringify(this.invoiceDetail.InvoiceDistributions));
          }
          if (this.invoiceDetail.InvoiceID > 0) {
            this.oldInvoiceAmount = this.invoiceDetail.InvoiceAmount;
            this.oldVendorID = this.invoiceDetail.VendorID;
          }

          this.vendorKey = this.invoiceDetail.VendorKey;

          let apiServiceBase = ApiUrl.baseUrl;
          this.pdfsrc1 = apiServiceBase + 'api/invoices/getPdf/'
            + this.invoiceDetail.CompanyNumber + '/' + this.invoiceDetail.AttachmentName;
          this.pdfsrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfsrc1);

          if (this.invoiceDetail.CashAccount != null) {
            this.cashAccount = this.invoiceDetail.SLCashAccount;
          }

          this.invoiceNumber = this.invoiceDetail.InvoiceNumber;
          if (this.InvoiceID != 0) {
            this.invoiceDate = this.invoiceDetail.InvoiceDate;
            this.postGlDate = this.invoiceDetail.PostDate;
            this.dueDate = this.invoiceDetail.DueDate;
          }
          if (this.purchaseOrders != undefined && this.purchaseOrders != null && this.purchaseOrders.length > 0) {
            this.purchaseOrders.forEach(item => {
              if (item.PuchaseOrderID === this.invoiceDetail.PurchaseOrderID) {
                this.poVendorKey = item.NumberKey;
                this.poNum = item.PONum;
                this.poInvDesc = item.InvoiceDescription;
                this.invoiceEntryService.getVendorById(this.invoiceDetail.CompanyID).then(res => {
                  if (res.status == 404 || res.status == 500) {
                  } else {
                    this.vendors = res;
                    this.vendors.forEach(item1 => {
                      if (item1.VendorID === this.invoiceDetail.VendorID) {
                        this.invoiceDetail.VendorName = item1.VendorName1;
                        this.invoiceDetail.VendorAddress = item1.VendorAddress;
                        this.invoiceDetail.VendorKey = item1.VendorKey;
                        this.vendorKey = item1.VendorKey;
                        this.dueDays = item1.DueDays;
                        this.cashAccount = item1.CashAccount;
                        this.achAcctName = item1.AchAcctName;

                        if (this.achAcctName != null && this.achAcctName !== '') {
                          let item = { ID: 0, Name: this.achAcctName }

                          this.paymentMethods.splice(1, 0, item);
                          this.selectedPaymentMethod.selected = [];
                          this.paymentMethods.forEach(item => {
                            if (item.ID == 1) {
                              this.selectedPaymentMethod.selected = item;
                            }
                          });
                        }


                      }
                    });
                  }

                });
              }

            });
          } if (this.invoiceDetail.IsFund == false) {
            this.getLedgerAccounts(this.invoiceDetail.CompanyID);
          } else {
            this.getFundPostCompaniesByCompanyID(this.invoiceDetail.CompanyID);
          }
        }
      });
    });
}

  private getFundPostCompaniesByCompanyID = function (companyId) {

    this.companiesService.getFundPostCompaniesByCompanyID(companyId).then(result => {
      if (result) {
        this.fundCompanies = result;
        let defaultCompany = {
          CompanyID: 0, CompanyNumber: 'Select Fund Property',
          CompanyName: 'Select Property', CompanyType: 'None', AccountID: 0
        };
        this.fundCompanies.splice(0, 0, defaultCompany);
        this.selectedFundCompany.selected = defaultCompany;
        this.fundCompanies.map((company: any) => {
          company.text = company.CompanyName;
        });
        let temp = this.fundCompanies;
        this.fundCompanies = [];
        temp.map((item: any) => {
          this.fundCompanies.push(
            { label: item.CompanyName, value: item });
        });

      }
      this.getCompanyDetail(companyId);
    });
  }

  private getSelectedFundCompanyDetails = function (fundCompanyID, companyNumber, companyName) {
    this.fundCompanyID = fundCompanyID;
    this.fundCompanyNumber = companyName;
    this.getLedgerAccounts(fundCompanyID);
  }


  private getCompanyDetail(CompanyID): void {
    this.invoiceEntryService
      .getCompanyDetail(CompanyID).then(result => {
        if (result.status == 404) {
        } else if (result.status == 500) {
        } else {
          this.companyData = result;
          if (this.cashAccount === 49 && this.companyData.CashAccount1Description !== 'Unknown') {
            this.Accountbind = 'AcDiscription1';
          } else if (this.cashAccount === 50 && this.companyData.CashAccount2Description !== 'Unknown') {
            this.Accountbind = 'AcDiscription2';
          } else if (this.cashAccount === 51 && this.companyData.CashAccount3Description !== 'Unknown') {
            this.Accountbind = 'AcDiscription3';
          } else if (this.cashAccount === 52 && this.companyData.CashAccount4Description !== 'Unknown') {
            this.Accountbind = 'AcDiscription4';
          } else {
            if (this.companyData.CashAccount1Description !== 'Unknown') {
              this.Accountbind = 'AcDiscription1';
            }
          }
          this.companyTooltip = '<b>Ledger Accounts:</b> ' +
            this.companyData.LedgerAccountCount + '<br /><b>Invoices:</b> ' + this.companyData.InvoiceCount +
            '<br /><b>Vendors:</b> ' + this.companyData.VendorCount + '<br /><b>PDFs:</b> ' +
            this.companyData.PDFCount + '<br /><b>Purchase Orders:</b> ' + this.companyData.PurchaseOrderCount +
            '<br ><b>Approval Criteria:</b> ' + this.companyData.ApprovalCriteriaCount +
            '<br /><b>Posts:</b> ' + this.companyData.FundCount + '<br />';
        }
        this.getVendorByCompanyID();
      });

  }

  private getVendorByCompanyID(): void {
    let companyID = 0;
    if (this.invoiceDetail.CompanyID != null) {
      companyID = this.invoiceDetail.CompanyID;
    }
    this.invoiceEntryService.getVendorById(companyID).then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.vendors = result;
        this.getJobs(this.invoiceDetail.CompanyID);
      }

    });
  }
  private getJobs(CompanyID): void {
    this.jobsService.getJobsByCompanyId(CompanyID).then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.jobs = result;
        let temp = this.jobs;
        this.jobs = [];
        temp.map((item: any) => {
          this.jobs.push({
            label: item.Description,
            value: item
          });
        });
      }

      if (this.invoiceDetail.JobID != null && this.invoiceDetail.JobID !== 0) {
        this.selectedJob.selected = [];

        this.jobs.forEach(function (item) {
          if (item.JobID === this.invoiceDetail.JobID) {
            this.selectedJob.selected = item;
            this.JobID = item.JobID;
            this.getJobCategory(this.JobID);
          }
        });
      }

       this.lockTimer = setInterval(() => {
            this.confirmLock();
        }, 60000);

      this.getInvoiceApprovals(this.invoiceDetail.InvoiceID, this.invoiceDetail.InvoiceAmount, this.invoiceDetail.CompanyID);


    });
  }


  private confirmLock(): void{
        this.documentType = 5;
        this.doctype = 'Attachment';
        this.documentID = 0;
        if (this.invoiceDetail.InvoiceID === 0) {
          this.documentType = 5;
          this.documentID = this.invoiceDetail.AttachmentID;
          this.doctype = 'Attachment';
        } else {
          this.documentType = 10;
          this.documentID = this.invoiceDetail.InvoiceID;
          this.doctype = 'Invoice';

        }
        this.masterService.confirmLock(this.DocumentLockingID ,this.doctype , this.documentID).then(result => {
      if (result.IsLocked === 0) {
                if (result.LockBy !== '') {
                    this.lockUserName = result.LockBy;
                    this.openInvoiceIsUnlockedModel();
                    if (this.lockTimer !== undefined) {
                        clearInterval(this.lockTimer);
                    }
                    return;
               }
           } else {
       }
    });
  }

  private openInvoiceIsUnlockedModel(){
     const builder = new BSModalContextBuilder<InvoiceEntryUnlockNotificationModelContext>(
      {
        unlockedBy:this.lockUserName
      } as any,
      undefined,
      InvoiceEntryUnlockNotificationModelContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(InvoiceEntryUnlockNotificationContext, overlayConfig)
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result != null) {
        }
      }, () => console.log(' Error In Dashboard invoice modal '));
    });



  }
  private getJobCategory(jobID): void {
    this.jobsService.getJobCategory(jobID).then(result => {
      if (result.status == 404 || result.status == 500) {
      } else {
        this.jobCategory = result;
        let temp = this.jobCategory;
        this.jobCategory = [];
        temp.map((item: any) => {
          this.jobCategory.push({
            label: item.Category,
            value: item
          });
        });
        this.invoiceDetail.JobID = jobID;
        this.jobCategory.forEach(item => {
          if (item.JobCategoryID === this.invoiceDetail.JobCategoryID) {
            this.selectedJobCategory.selected = item;

          }
        });
      }
    });

  }

  private SelectJobCategory(JobCategoryID): void {
    this.invoiceDetail.JobCategoryID = JobCategoryID;
  }
  private addGlAccountByPopup(led) {
    // this.invoiceDetail.InvoiceDistributions

    this.glAccountObject.glAccountNumber = led.LedgerAccountName;
    this.glAccountObject.glAccountDescription = this.invoiceDetail.Description;
    // let fcs_description = true;

    if (this.invoiceDetail.InvoiceAmount == 0 || this.invoiceDetail.InvoiceAmount == null) {
      this.toastr.error('Invoice Amount can not be Zero');
      return;
    }

    if (this.invoiceDetail.InvoiceDistributions.length == 0) {
      this.glAccountObject.glAccountAmount = this.invoiceDetail.InvoiceAmount;
    }
    else if (this.invoiceDetail.InvoiceDistributions.length > 0) {
      let totalDistAmount: number = this.glAccountObject.glAccountAmount;
      for (let i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
        totalDistAmount = Number((Number(totalDistAmount)
          + Number(this.invoiceDetail.InvoiceDistributions[i].DistributionAmount)).toFixed(2));
      }
      if (this.invoiceDetail.InvoiceAmount !== totalDistAmount) {
        this.glAccountObject.glAccountAmount = Number((Number(this.invoiceDetail.InvoiceAmount) - Number(totalDistAmount)).toFixed(2));
      }
    }

  }

  private addGlAccount() : void {
    let isMacthed = false;
    // this.invoiceEntryService
    //   .getLedgerAccountDDOsAccountTypeWise(this.invoiceDetail.CompanyID)
    //   .then(result => {
    //     if (result.status == 404 || result.status == 500) {
    //     } else {
    //       this.ledgerAccounts = result;
          if (this.ledgerAccounts !== undefined &&  this.ledgerAccounts != null && this.ledgerAccounts.length > 0
                && (this.glAccountObject.glAccountNumber !== undefined && this.glAccountObject.glAccountNumber !== '' && this.glAccountObject.glAccountNumber !== null)) {
            this.ledgerAccounts.forEach(item => {
              if (item.LedgerAccountName === this.glAccountObject.glAccountNumber) {
                isMacthed = true;
                //  this.glAccountNumber = item.LedgerAccountName;
                if (this.invoiceDetail.InvoiceAmount === 0 || this.invoiceDetail.InvoiceAmount == null) {
                  this.toastr.error('Invoice Amount can not be Zero');
                  return;
                }
                if (this.glAccountObject.glAccountAmount === 0 || this.glAccountObject.glAccountAmount == null) {
                  this.toastr.error('Distribution Amount can not be Zero');
                  return;
                } else {
                  this.GetSelectedLedgderAccounts(item);
                }

              }
            });

            if (isMacthed === false) {

              this.toastr.error('No Account Number match with this Key');
            }

          }
      //   }

      // });


  }

  private GetSelectedLedgderAccounts(ledAccount): void {
    this.glAccountObject.glAccountNumber = ledAccount.LedgerAccountName;

    let item = {
      DistributionID: 0,
      LedgerAccountID: ledAccount.LedgerAccountID,
      InvoiceID: this.invoiceID,
      AccountNumber: ledAccount.AccountNumber,
      AccountTitle: ledAccount.LedgerAccount,
      AccountDestribution: 0,
      DistributionAmount: parseFloat(this.glAccountObject.glAccountAmount.toString()),
      DistributionComment: this.glAccountObject.glAccountDescription,
      DistAmountPopoverUrl: 'DistAmountPopover.html',
      DistCommentPopoverUrl: 'DistCommentPopover.html',
      FundCompanyID: this.fundCompanyID,
      FundCompanyNumber: this.fundCompanyNumber
    }

    this.invoiceDetail.InvoiceDistributions.splice(1, 0, item);
    this.isAddAccount = false;
    this.glAccountObject = new GlAccountObject();
    this.fundCompanyID = 0;
    this.fundCompanyNumber = '';
    if (this.invoiceDetail.IsFund == true) {
      this.selectedFundCompany.selected = [];
      var obj = { CompanyID: 0, CompanyNumber: 'Select Fund', CompanyName: 'Select Fund', CompanyType: 'None', AccountID: 0 };
      this.selectedFundCompany.selected = obj;
      this.ledgerAccounts = [];
    }
  }

  private processInvAmtToDistribution(amt): void {
    if (this.invoiceDetail.InvoiceDistributions.length === 1) {
      this.invoiceDetail.InvoiceDistributions[0].DistributionAmount = amt;
    }

  }

  private checkInvoiceNumberExists($event): void {

    if (this.invoiceDetail.InvoiceNumber > 0 && this.invoiceDetail.InvoiceNumber != null) {
      this.invoiceAlert = '';
      this.invoiceExistItems = {
        InvoiceNumber: this.invoiceDetail.InvoiceNumber,
        VendorID: this.invoiceDetail.VendorID,
        CompanyID: this.invoiceDetail.CompanyID,
        InvoiceID: this.invoiceDetail.InvoiceID,
        invoiceDate: this.invoiceDate
      }

      this.invoiceService
        .checkInvoiceNumberExists(this.invoiceExistItems).then(result => {
          if (result) {
            if (this.invoiceDetail.InvoiceID === 0 || this.invoiceDetail.InvoiceID == null) {
              this.invoiceDetail.InvoiceNumber = 0;
            }
            this.vendorKey = '';
            this.invoiceDetail.VendorID = null;
            this.invoiceDetail.VendorName = '';
            this.invoiceDetail.VendorAddress = '';
            this.invoiceDetail.VendorKey = '';
            this.dueDays = 0;
            this.cashAccount = null;
            this.achAcctName = '';
            this.AccountNumber = '';
            this.invoiceDate = '';
            this.dueDate = '';
            this.postGlDate = '';

            this.toastr.error("Invoice", 'This Invoice Number with same vendor and same invoice date is  already exists in this property');
          }
        });

    }


  }

  private checkPONumber(poNum, $event): void {

    let isMacthed = false;
    if (this.purchaseOrders != null && this.purchaseOrders.length > 0 && (poNum != null && poNum !== '')) {
      this.purchaseOrders.forEach(item => {
        if (item.PONum.toLowerCase() === poNum.toLowerCase()) {
          isMacthed = true;
          this.GetSelectedPurchaseOrder(item.PuchaseOrderID);
        }
      });

      if (isMacthed === false) {
        this.poNum = '';
        this.invoiceDetail.PurchaseOrderID = null;
        this.poVendorKey = '';
        this.poInvDesc = '';
        this.invoiceDetail.InvoiceAmount = 0;
        this.toastr.error('No PO Number match with this Key');
      }
    }
  }

  private checkVendorKey(vendorKey, $event): void {
    let isMacthed = false;
    if (this.vendors != null && this.vendors.length > 0 && (vendorKey != null && vendorKey !== '')) {
      this.vendors.forEach(item => {
        if (item.VendorKey.toLowerCase() === vendorKey.toLowerCase()) {
          isMacthed = true;
          this.invoiceDetail.VendorID = item.VendorID;
          this.GetSelectedVendors(item.VendorID);
        }
      });

      if (isMacthed === false) {
        $event.target.select();
        this.vendorKey = '';
        this.invoiceDetail.VendorID = null;
        this.invoiceDetail.VendorName = '';
        this.invoiceDetail.VendorAddress = '';
        this.invoiceDetail.VendorKey = '';
        this.dueDays = 0;
        this.cashAccount = null;
        this.achAcctName = '';
        this.AccountNumber = '';
        this.toastr.error('No Vendor Key match with this Key');
      }
    }
  }

  private GetSelectedVendors(venID): void {
    this.invoiceDetail.VendorID = venID;
    this.invoiceExistItems = {
      InvoiceNumber: this.invoiceDetail.InvoiceNumber,
      VendorID: this.invoiceDetail.VendorID,
      CompanyID: this.invoiceDetail.CompanyID,
      InvoiceID: this.invoiceDetail.InvoiceID,
      invoiceDate: this.invoiceDate
    }
    // $rootScope.showLoading = false;
    this.invoiceService.checkInvoiceNumberExists(this.invoiceExistItems).then(result => {
      if (result) {
        if (this.invoiceDetail.InvoiceID === 0 || this.invoiceDetail.InvoiceID == null) {
          this.invoiceDetail.InvoiceNumber = 0;
        }
        this.vendorKey = '';
        this.invoiceDetail.VendorID = null;
        this.invoiceDetail.VendorName = '';
        this.invoiceDetail.VendorAddress = '';
        this.invoiceDetail.VendorKey = '';
        this.dueDays = 0;
        this.cashAccount = null;
        this.achAcctName = '';
        this.AccountNumber = '';
        this.dueDate = '';
        this.invoiceDate = '';
        this.postGlDate = '';
        this.toastr.error(("Invoice", 'This Invoice Number with same vendor and same invoice date is  already exists in this property'));
      } else {

        this.ProcessVendor(venID);
      }
    });
  }

  private GetSelectedPurchaseOrder(poID): void {
    // this.$parent.searchTerm = '';
    this.purchaseOrders.forEach(item => {
      if (item.PuchaseOrderID === poID) {
        this.invoiceDetail.PurchaseOrderID = poID;
        this.poVendorKey = item.NumberKey;
        this.poInvDesc = item.InvoiceDescription;
        this.invoiceDetail.InvoiceAmount = item.POAmount;
        this.poNum = item.PONum;
        let vendorID = item.VendorID;
        this.ProcessVendor(vendorID);
      }
    });

  }
  private getLedgerAccounts(CompanyID): void {
    this.invoiceEntryService
      .getLedgerAccountDDOsAccountTypeWise(CompanyID)
      .then(result => {
        if (result) {
          this.ledgerAccounts = result;
          this.LedgerAccountsCount = 'Available properties';
        }
        this.getCompanyDetail(this.invoiceDetail.CompanyID);
      });
  }

  private ProcessVendor(vendorID): void {
    this.vendors.forEach(item1 => {
      if (item1.VendorID === vendorID) {
        this.invoiceDetail.VendorID = item1.VendorID;
        this.invoiceDetail.VendorName = item1.VendorName1;
        this.invoiceDetail.VendorAddress = item1.VendorAddress;
        this.invoiceDetail.VendorKey = item1.VendorKey;
        this.vendorKey = item1.VendorKey;
        this.dueDays = item1.DueDays;
        this.cashAccount = item1.CashAccount;
        this.achAcctName = item1.AchAcctName;
        this.AccountNumber = item1.AccountNumber;

        if (this.AccountNumber != null && this.AccountNumber !== '') {

          this.ledgerAccounts.forEach(item2 => {
            if (item2.AccountNumber === this.AccountNumber) {


              let item = {
                DistributionID: 0,
                LedgerAccountID: item2.LedgerAccountID,
                InvoiceID: this.invoiceID,
                AccountNumber: item2.AccountNumber,
                AccountTitle: item2.LedgerAccount,
                AccountDestribution: 0,
                DistributionAmount: parseFloat(this.invoiceDetail.InvoiceAmount.toString()),
                DistributionComment: 'Click to Comment',
                DistAmountPopoverUrl: 'DistAmountPopover.html',
                DistCommentPopoverUrl: 'DistCommentPopover.html'
              }

              if (isNaN(item.DistributionAmount) || item.DistributionAmount == null) {
                item.DistributionAmount = parseFloat((0.00).toString());
              }


              this.invoiceDetail.InvoiceDistributions.splice(1, 0, item);
            }
          });

        }
      }
    });
  }

  private addAccount() {
    this.isAddAccount = true;
    this.fcs_AccountNum = true;
    setTimeout(() => { this.inputFocusedss = false });
  }
  private checkglAccountNumber(glAccountNumber, $event): void {
    let isMacthed = false;
    // this.fcs_AccountNum = true;
    if(this.ledgerAccounts !== undefined && this.ledgerAccounts !== []){
    if (this.ledgerAccounts.length > 0 && (glAccountNumber != null && glAccountNumber !== '')) {
      this.ledgerAccounts.forEach(item => {
        if (item.LedgerAccountValue === glAccountNumber) {
          glAccountNumber = glAccountNumber + '-0000';
        }

        if (item.LedgerAccountName === glAccountNumber) {
          if (parseFloat(
            this.invoiceDetail.InvoiceAmount.toString()) === 0
            || parseFloat(this.invoiceDetail.InvoiceAmount.toString()) == null) {
            this.toastr.error('Invoice Amount can not be Zero');
          }
          isMacthed = true;
          this.glAccountObject.glAccountNumber = item.LedgerAccountName;
          this.glAccountObject.glAccountDescription = this.invoiceDetail.Description;

          if (this.invoiceDetail.InvoiceDistributions.length === 0) {
            this.glAccountObject.glAccountAmount = this.invoiceDetail.InvoiceAmount;
          } else if (this.invoiceDetail.InvoiceDistributions.length > 0) {
            let totalDistAmount = this.glAccountObject.glAccountAmount;
            for (let i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
              totalDistAmount = parseFloat((totalDistAmount.toString()))
                + parseFloat((this.invoiceDetail.InvoiceDistributions[i].DistributionAmount.toString()));
            }

            if ((parseFloat(this.invoiceDetail.InvoiceAmount.toString())) !== (totalDistAmount)) {
              this.glAccountObject.glAccountAmount =
                (this.invoiceDetail.InvoiceAmount - totalDistAmount);
            }
          }

          this.fcs_description = true;
        }
      });

      if (isMacthed === false) {

        this.glAccountObject = new GlAccountObject();


        this.toastr.error('No Account Number match with this Key');
      }

    }
   }
  }

  private removeInvoiceDistributions(distID, $index): void {
    this.invoiceDetail.InvoiceDistributions.splice($index, 1);

  }

  private checklockingStatusForExit(invoiceID): void {
    let route;
      this.prevoiusRouteState = this.localStorageService.get('routeData');
    if (invoiceID > 0) {
    if (this.prevoiusRouteState.prevoiusRoute === 'dashboard') {
        route = this.dashboardBackLink;
          } else if (this.prevoiusRouteState.prevoiusRoute === 'invoices') {
        route  = this.invoiceBackLink;
        }
    } else {
        route = this.attachmentBackLink;
    }

    if (this.invoiceDetail.LockedByID === this.user.userId) {
        this.unlockDocument(route);
    } else {
        this.router.navigate([route]);
    }
  }

  private setDueDateByInvoiceDate(): void {

    if (this.invoiceDate !== '' && (moment(this.invoiceDate, 'MM/DD/YY', true).isValid() || moment(this.invoiceDate, 'MM/DD/YYYY', true).isValid())) { 

      this.invoiceDate = moment(this.invoiceDate).format('MM/DD/YYYY');
      let date = new Date(this.invoiceDate);
      this.postGlDate = this.invoiceDate;
      let newdate = new Date(date.toDateString());

      newdate.setDate(newdate.getDate() + Number(this.dueDays));

      let dd = newdate.getDate();
      let mm = newdate.getMonth() + 1;
      let y = newdate.getFullYear();

      let someFormattedDate = mm + '/' + dd + '/' + y;

      if ((moment(someFormattedDate, 'MM/DD/YYYY', true).isValid() || moment(someFormattedDate, 'M/D/YYYY', true).isValid())) {
        this.dueDate = someFormattedDate;
      } else {
        this.dueDate = '01/01/2001';
        this.invoiceDate = '01/01/2001';
        this.postGlDate = '01/01/2001';
        this.toastr.error('Date not is in correct format');
      }
      this.checkInvoiceNumberExists(null);
    } else {
      this.dueDate = '01/01/2001';
      this.invoiceDate = '01/01/2001';
      this.postGlDate = '01/01/2001';
       this.toastr.error('Date not is in correct format');
    }
  }

  private saveInvoice(value): void {
    // this.xyz = jQuery().find('#invoice_InvDate').val();
    // alert(this.xyz);

    this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID).then(result => {
      if (result.IsLocked === 0) {
        this.toastr.error('This pdf is locked by ' + result.LockBy);
      } else {

        this.errors = [];
        this.errorHeader = '';
        if (this.invoiceDetail.InvoiceAmount === 0 || this.invoiceDetail.InvoiceAmount == null) {
          this.invoiceDetail.InvoiceAmount = 0;
        }

        this.ValidateInvoice();

        if (this.errors.length === 0) {

          if (this.invoiceDate != null && this.invoiceDate !== '') {

            this.invoiceDetail.InvoiceDate = this.invoiceDate;

          }
          if (this.dueDate != null && this.dueDate !== '') {
            this.invoiceDetail.DueDate = this.dueDate;
          }

          if (this.postGlDate != null && this.postGlDate !== '') {
            this.invoiceDetail.PostDate = this.postGlDate;

          }

          if (this.Accountbind === 'AcDiscription1') {
            this.invoiceDetail.SLCashAccount = 49;
            this.invoiceDetail.CashAccountID = this.companyData.cash_account_1_id;
          } else if (this.Accountbind === 'AcDiscription2') {
            this.invoiceDetail.SLCashAccount = 50;
            this.invoiceDetail.CashAccountID = this.companyData.cash_account_2_id;
          } else if (this.Accountbind === 'AcDiscription3') {
            this.invoiceDetail.SLCashAccount = 51;
            this.invoiceDetail.CashAccountID = this.companyData.cash_account_3_id;
          } else if (this.Accountbind === 'AcDiscription4') {
            this.invoiceDetail.SLCashAccount = 52;
            this.invoiceDetail.CashAccountID = this.companyData.cash_account_4_id;
          } else {
            this.invoiceDetail.SLCashAccount = 49;
            this.invoiceDetail.CashAccountID = this.companyData.cash_account_1_id;
          }

          this.invoiceService.getNextAttachmentIDs(this.attachmentId).then(result1 => {
            this.invoiceService.saveInvoice(this.invoiceDetail).then(result => {
              if (result.status == 404) {
              } else if (result.status == 500) {
                this.displayValue = 'none';
                this.toastr.error('error', JSON.parse(result._body).Message, 'error');
              } else {

                this.displayValue = 'none';
                this.invoiceAlert = '';

                if (value === 'isSaveAndContinue') {
                  if (result1 == null
                    || result1 === 0
                    || result1 === ''
                    || result1 === '0'
                    || result1 === 'null') {
                    this.toastr.success('Invoice saved successfully');
                    this.unlockDocument('/dashboard');
                  } else {
                    this.toastr.success('Invoice saved successfully');

                    // $anchorScroll('invoiceentryview');
                    this.NextAttchID = result1;
                    this.unlockDocument('/invoices/'
                      + this.pageSizeFilter + '/'
                      + this.searchParameters + '/'
                      + this.invoiceID + '/new/'
                      + Number(this.NextAttchID));
                  }
                }
                if (value === 'isSave') {
                  this.toastr.success('Invoice saved successfully');
                  this.unlockDocument('/invoice/detail/'

                    + this.pageSizeFilter + '/'
                    + this.searchParameters + '/'
                    + Number(result) + '/'
                    + null
                    + '/' + 0 + '/' + 0 + '/' + 0 + '/' + 0);

                }
                if (value === 'isSaveAfterEdit' || value === 'isExpedited' || value === 'isSubmitforApproval') {
                  this.toastr.success('Invoice saved successfully');
                  this.unlockDocument('/dashboard');
                }

                if (value === 'getInvoiceGrid') {
                  this.toastr.success('Invoice saved successfully');
                  this.unlockDocument('/invoice/' + +this.pageSizeFilter + '/' + this.searchParameters);
                }
              }
            });
          });
        } else {
          document.body.scrollTop = 0;
        }
      }
    });
  }

  private unlockDocument(linkString): void {
    this.documentType = 5;
    this.doctype = 'Attachment';
    this.documentID = 0;
    if (this.invoiceDetail.InvoiceID === 0) {
      this.documentType = 5;
      this.documentID = this.invoiceDetail.AttachmentID;
      this.doctype = 'Attachment';
    } else {
      this.documentType = 10;
      this.documentID = this.invoiceDetail.InvoiceID;
      this.doctype = 'Invoice';

    }

    this.masterService.unlockDocument(this.documentID, this.user.userId, this.documentType).then(result => {
      if (result) {
      } else {
        // if ($rootScope.intervalPromise != undefined) {
        //     $interval.cancel($rootScope.intervalPromise);
        // }
      }
      this.router.navigate([linkString]);

    });
  }
  private checkInvoiceStatus(invDetails, status): void {
    if (invDetails.InvoiceAmount > 0) {
      this.saveInvoice(status);
    } else {
      if (status === 'isSubmitforApproval') {
        this.toastr.error("Invoice", 'Invoice amount is zero.so can not submit this invoice for approval');
        return;
      }

      if (status === 'isExpedited') {
        this.toastr.error('Invoice amount is zero.so can not expedite this invoice');
        return;
      }
    }
  }
  private ValidateInvoice(): void {
    this.errors = [];
    if (this.invoiceDetail.InvoiceNumber == null) {
      let obj = {
        ErrorName: 'Invoicenumber cant be blank'
      };
      this.invoiceAlert = { 'border': '1px solid red' };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (this.invoiceDetail.VendorID == null) {
      let obj = {
        ErrorName: 'Vendor cant be blank'
      };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (this.invoiceDate === '' || this.invoiceDate == null) {
      let obj = {
        ErrorName: 'InvoiceDate cant be blank'
      };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (this.invoiceDate !== '' && this.invoiceDate != null) {
      let isValid = moment(this.invoiceDate, 'MM/DD/YYYY', true).isValid();
      if (isValid === false) {
     let obj = {
        ErrorName: 'Invoice Date is not valid'
      };
      this.errors.splice(this.errors.length, 0, obj);
    }
  }


    if (this.postGlDate === '' || this.postGlDate == null) {
      let obj = {
        ErrorName: 'Post GL Date cant be blank'
      };
      this.errors.splice(this.errors.length, 0, obj);
    }


    if (this.postGlDate !== '' && this.postGlDate != null) {
     let isValid = moment(this.postGlDate, 'MM/DD/YYYY', true).isValid();
      if (isValid === false) {
        let obj = { ErrorName: 'postGlDate format is wrong' };
        this.errors.splice(this.errors.length, 0, obj);
      }
    }


      if (this.postGlDate === '' || this.postGlDate == null) {
        let obj = {
          ErrorName: 'Post GL Date cant be blank'
        };
        this.errors.splice(this.errors.length, 0, obj);
      }


      if(this.invoiceDetail.InvoiceAmount === undefined ||  this.invoiceDetail.InvoiceAmount === 0
                     || this.invoiceDetail.InvoiceAmount === 0.00){
                     let obj = {
                    ErrorName: 'Invoice amount cant not be zero'
                  };
                  this.errors.splice(this.errors.length, 0, obj);    

      }

      if (this.dueDate === '' || this.dueDate == null) {
        let obj = {
          ErrorName: 'DueDate cant be blank'
        };
        this.errors.splice(this.errors.length, 0, obj);
      }


      if (this.invoiceDetail.JobID !== 0 && this.invoiceDetail.JobID != null) {
        if (this.invoiceDetail.JobCategoryID === 0 || this.invoiceDetail.JobCategoryID == null) {
          let obj = {
            ErrorName: 'job category cant be blank'
          };
          this.errors.splice(this.errors.length, 0, obj);
        }
      }

      if(this.invoiceDetail !== undefined  && this.invoiceDetail.InvoiceDistributions !== undefined &&
              this.invoiceDetail.InvoiceDistributions.length !== undefined && this.invoiceDetail.InvoiceDistributions.length === 0 ){
                  let obj = {
                      ErrorName: 'Invoice distribution list can not be blank'
                    };
                    this.errors.splice(this.errors.length, 0, obj);
              }

      for (let i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
        if (this.invoiceDetail.InvoiceDistributions[i].DistributionAmount === 0
          || this.invoiceDetail.InvoiceDistributions[i].DistributionAmount === 0.00) {
          let obj = { ErrorName: 'Distributions amount can not be zero.please enter the amount' };
          this.errors.splice(this.errors.length, 0, obj);
        }
      }


      if (this.invoiceDetail.InvoiceAmount != null) {
        let totalAmount = 0.00;
        if (this.invoiceDetail.InvoiceDistributions.length > 0) {
          for (let i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
            if (this.invoiceDetail.InvoiceDistributions[i].DistributionAmount == 0) {
              this.invoiceDetail.InvoiceDistributions[i].DistributionAmount = 0.00;
            }
            totalAmount = (Number(totalAmount) + Number(this.invoiceDetail.InvoiceDistributions[i].DistributionAmount));
          }
        }

        if ((Number(this.invoiceDetail.InvoiceAmount)) != (totalAmount)) {
          let obj = { ErrorName: 'Invoice amount and total distribution amount are not equal' };
          this.errors.splice(this.errors.length, 0, obj);
        }
      }

        if(this.invoiceDetail.InvoiceID >0){
          if(this.oldInvoiceAmount != this.invoiceDetail.InvoiceAmount){
            this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
          }
          if(this.oldVendorID != this.invoiceDetail.VendorID){
            this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
          }
          if(this.oldInvoiceDistributionsJson != (JSON.stringify(this.invoiceDetail.InvoiceDistributions))){
             this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
          }
      }

      if (this.errors.length > 0) {
        this.displayValue = 'alert alert-danger';
        this.errorHeader = this.errors.length + ' errors prohibited this inovice from being saved:';
        // $(window).scrollTop(0);
        return;
      }


      if (this.invoiceDetail.InvoiceID > 0) {
        if (this.oldInvoiceAmount != this.invoiceDetail.InvoiceAmount) {
          this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
        }
        if (this.oldVendorID != this.invoiceDetail.VendorID) {
          this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
        }
        if (this.oldInvoiceDistributionsJson != (JSON.stringify(this.invoiceDetail.InvoiceDistributions))) {
          this.invoiceDetail.IsInvoiceApprovalStateResetRequired = true;
        }

      }

  }
 

  private SubmitInvoiceForApproval(invoice): void {
    if (this.invApprovals != undefined && this.invApprovals.InvoiceApprovals != undefined  && this.invApprovals.InvoiceApprovals.length > 0) {
      this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID).then(result => {
        if (result.IsLocked == 0) {
          this.toastr.error("This invoice is locked by " + result.LockBy);
          return;

        } else {
          this.ValidateInvoice();

          if (this.errors.length == 0) {
            if (invoice.InvoiceAmount == "0" || invoice.InvoiceAmount == "" || invoice.InvoiceAmount == null) {
              invoice.InvoiceAmount = 0;
            }

            if (invoice.InvoiceAmount != 0 && invoice.InvoiceAmount != 0.00) {
              this.invoiceService.saveInvoice(this.invoiceDetail).then(result => {

                if (result) {
                  // }
                  // else if (result.status == 500) {
                  //     this.showHideErrorLog = { 'display': 'none' };
                  //     this.displayValue = 'none';
                  //     messageService.showMsgBox("error", result.data.ExceptionMessage, "error");
                  // }
                  // else {
                  if (invoice.InvoiceAmount != 0 && invoice.InvoiceAmount != 0.00) {
                    this.invoiceService.submitInvoiceForApproval(invoice.InvoiceID).then(result => {
                      if (result) {

                        this.toastr.success("Invoice submit for approval successfully");
                        if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && this.invoiceIDs.NextInvoiceID > invoice.InvoiceID) {
                          this.unlockDocument('/invoices/-1/' + parseInt(this.invoiceIDs.NextInvoiceID) + '/edit');
                        } else {
                          this.unlockDocument('/dashboard');
                        }
                      }
                    });
                  }
                }
              });
            }

            else {
              this.toastr.error("Invoice amount is zero.so can not submit this invoice for approval");
              return false;
            }
          }
        }
      });
    }
    else {
      this.openNoApproverExistsModal()
    }
  }

  private getInvoiceApprovals(invoiceID, InvoiceAmount, CompanyID) {
    this.invoiceService.getInvoiceApprovals(invoiceID, InvoiceAmount, CompanyID).then(result => {
      if (result) {
        this.invApprovals = result;
      }

      if (this.invoiceDetail.IsFund) {
        this.getCompanyListFilteredByFundProperties();
      }
    });
  }

  private getCompanyListFilteredByFundProperties() {

    this.companiesService.getCompanyListFilteredByFundProperties(this.invoiceDetail.CompanyID).then(result => {
      if (result) {
        this.companies = result;
        let defaultCompany = { CompanyID: 0, CompanyNumber: 'Select Property', CompanyName: 'Select Property', CompanyType: 'None', AccountID: 0 };

        this.selectedCompany.selected = defaultCompany;
        this.companies.splice(0, 0, defaultCompany);

        this.companies.map((company: any) => {
          company.text = company.CompanyName;
        });
        let temp = this.companies;
        this.companies = [];
        temp.map((item: any) => {
          this.companies.push(
            { label: item.CompanyName, value: item });
        });

      }
    });
  }



  private submitInvoiceExpedite(invoice): void {
    this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID).then(result => {
      if (result.IsLocked == 0) {
        this.toastr.error("This invoice is locked by " + result.LockBy);
        return;

      } else {
        this.ValidateInvoice();
        if (this.errors.length == 0) {
          if (invoice.InvoiceAmount == "0" || invoice.InvoiceAmount == "" || invoice.InvoiceAmount == null) {
            invoice.InvoiceAmount = 0;
          }

          if (invoice.InvoiceAmount != 0 && invoice.InvoiceAmount != 0.00) {
            this.invoiceService.saveInvoice(this.invoiceDetail).then(result => {

              if (result) {
                // }
                // else if (result.status == 500) {
                //     messageService.showMsgBox("error", result.data.ExceptionMessage, "error");
                // }
                // else {
                this.invoiceService.submitInvoiceExpedite(invoice.InvoiceID).then(result => {
                  if (result) {
                    // }
                    // else {
                    this.toastr.success("Invoice expedited successfully");
                    if (this.invoiceIDs != undefined && this.invoiceIDs.NextInvoiceID != null && this.invoiceIDs.NextInvoiceID > invoice.InvoiceID) {
                      this.unlockDocument('/invoices/-1/' + parseInt(this.invoiceIDs.NextInvoiceID) + '/edit');
                    } else {
                      this.unlockDocument('/dashboard');
                    }
                  }
                });
              }
            });
          }
          else {
            this.toastr.error("Invoice amount is zero.so can not expedite this invoice");
            return false;
          }
        }
      }
    });

  }

  ngOnDestroy(){
            clearInterval(this.lockTimer);
  }

}





