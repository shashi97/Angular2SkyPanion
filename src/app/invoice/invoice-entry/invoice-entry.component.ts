import { Component, OnInit, Pipe, ViewContainerRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
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
import { InvoiceDetail, invSearchObject, PurchaseOrder, CompanyData, Vendors,
	LedgerAccounts, GlAccountObject, InvoiceExistItems, JobCategory } from '../../invoice/invoice-entry/shared/invoice-entry.model';
import { JobModel } from '../../job/shared/job.model';
import { UserModel } from '../../user/shared/user.model';
import { JobsService } from '../../job/shared//jobs.service';
import { InvoiceService } from '../../invoice/shared/invoice.service';
import { ApiUrl } from '../../config.component';
import * as moment from 'moment';
import { CompanyModel } from '../../companies/shared/company.model';
import { CompanyService } from '../../companies/shared/company.service';
import {BrowserModule} from '@angular/platform-browser';
import { MasterService } from '../../shared/services/master/master.service';
import {DomSanitizer} from "@angular/platform-browser";
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { InvoiceEntryPurchaseModalContext, InvoiceEntryPurchaseComponent } from '../../invoice/invoice-entry-components/purchase-model/invoice-entry-purchase.component';
import { InvoiceEntryVendorModalContext, InvoiceEntryVendorComponent } from '../../invoice/invoice-entry-components/vendors-model/invoice-entry-vendor.component';
import { InvoiceEntryAccountModalContext, InvoiceEntryAccountsComponent } from '../../invoice/invoice-entry-components/accounts-model/invoice-entry-accounts.component';
import { InvoiceRejectModalContext, InvoiceRejectModalComponent } from '../../invoice/invoice-entry-components/invalid-remove-invoice/invalid-remove-invoice.component';

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

declare let jQuery: any;
@Component({
	selector: 'sp-invoice-entry',
	templateUrl: 'invoice-entry.component.html',

})

export class InvoiceEntryComponent extends BaseComponent implements OnInit, AfterViewInit {

	private attachmentId: number = 0;
	private invoiceID: number = 0;
	private InvoiceID: number = 0;
	private isAddAccount;
	private CompanyID: number = 0;
	private companyData: CompanyData;
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
	private vendors: Array<Vendors>;
    private jobs: Array<JobModel>;
	private companies: Array<CompanyModel>;
	private selectedJob = {
		selected: []
	}
	private selectedJobCategory = {
		selected: {}
	}
	private selectedPaymentMethod = {
		selected: {}
	}
	private selectedCompany = {
		selected: {}

	}
	private errors;
	private displayValue: string = '';
	private errorHeader;
	private pdfsrc1;
	private pdfsrc;
    private invoiceAlert;
	private glAccountObject: GlAccountObject;
	private dueDays;
	private achAcctName = '';
	private AccountNumber: string = '';
	private invoiceDate: string = "";
	private dueDate: string = '';
	private postGlDate: string = '';
    private poNum;
	private doctype;
	private documentID;
	private NextAttchID;
    private poVendorKey;
    private poInvDesc;
	private documentType;
	private paymentMethods;
	private pageSizeFilter;
	private searchParameters;
	private LedgerAccountsCount;
	private invoiceIDs: InvoiceModel;
	private fcs_AccountNum;
	private fcs_description;
	private invoiceDetail: InvoiceDetail;
	private purchaseOrders: Array<PurchaseOrder>;
    private invoiceNumber;
	private invoiceBackLink;
	private invoiceExistItems: InvoiceExistItems;
	private User: UserModel;
	private jobCategory: Array<JobCategory>;
	private ledgerAccounts: Array<LedgerAccounts>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private domSanitizer: DomSanitizer,
		localStorageService: LocalStorageService,
		router: Router,
		private jobsService: JobsService,
		private companiesService: CompanyService,
		private masterService: MasterService,
		private invoiceEntryService: InvoiceEntryService,
		private invoiceService: InvoiceService,
		overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal
	) {
		super(localStorageService, router);
		overlay.defaultViewContainer = vcRef;
        this.invoiceDetail = new InvoiceDetail();
		this.isAddAccount = true;
		this.fcs_AccountNum = false;
		this.companyData = new CompanyData();
		this.glAccountObject = new GlAccountObject();
		this.purchaseOrders = new Array<PurchaseOrder>();
		this.invSearchObject = new invSearchObject();
		this.jobCategory = new Array<JobCategory>();
		this.pageSizeFilter = 25;
		this.searchParameters = -1;
		this.invoiceBackLink = '/invoicesList/' + this.pageSizeFilter + '/' + this.searchParameters;
	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		this.activatedRoute.params.subscribe(params => {
			this.attachmentId = +params['attachmentId']; // (+) converts string 'id' to a number
		});
		this.getCompanies();
		if (this.sessionDetails.userId != null) {
		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}

	ngAfterViewInit() {
		jQuery("#Invoice_date").datepicker({
			dateFormat: 'dd/mm/yy',
			onClose: dateText => {
				this.invoiceDate = dateText;
			}
		});
		jQuery("#Due_date").datepicker({
			dateFormat: 'dd/mm/yy',
			onClose: dateText => {
				this.dueDate = dateText;
			}
		});
		jQuery("#Gl_date").datepicker({
			dateFormat: 'dd/mm/yy',
			onClose: dateText => {
				this.postGlDate = dateText;
			}
		});
	}
	openPurchaseModal() {
		const builder = new BSModalContextBuilder<InvoiceEntryPurchaseModalContext>(
            { num1: 2, num2: 3 } as any,
            undefined,
            InvoiceEntryPurchaseModalContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		const dialog = this.modal.open(InvoiceEntryPurchaseComponent, overlayConfig)
		dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
            // alert(result.status);
               if (result !=null) {
               this.GetSelectedPurchaseOrder(result);
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
			context: builder.toJSON()
		};

		const dialog = this.modal.open(InvoiceEntryVendorComponent, overlayConfig)
		 dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
            // alert(result.status);
               if (result !=null) {
                 this.GetSelectedVendors(result);
                }
            }, () => console.log(' Error In Vendor modal '));
        });
		
	}

	openAccountModal() {
		const builder = new BSModalContextBuilder<InvoiceEntryAccountModalContext>(
            { num1: 2, num2: 3 } as any,
            undefined,
            InvoiceEntryAccountModalContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		const dialog = this.modal.open(InvoiceEntryAccountsComponent, overlayConfig)
			 dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
            // alert(result.status);
               if (result !=null) {
                   this.addGlAccountByPopup(result);
                }
            }, () => console.log(' Error In Attachment Edit modal '));
        });
		
	}
	openAttachmentEditModal() {
		const builder = new BSModalContextBuilder<InvoiceRejectModalContext>(
            {
				DocumentLockingID: this.DocumentLockingID,
				doctype: this.doctype,
				DocumentID: this.DocumentID,
				attachmentId: this.attachmentId,
				pageSizeFilter: this.pageSizeFilter,
				searchParameters: this.searchParameters
			} as any,
            undefined,
            InvoiceRejectModalContext
		);

		let overlayConfig: OverlayConfig = {
			context: builder.toJSON()
		};

		const dialog = this.modal.open(InvoiceRejectModalComponent, overlayConfig)

		 dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
            // alert(result.status);
               if (result !=null) {
                    this.unlockDocument(result);
                }
            }, () => console.log(' Error In Attachment Edit modal '));
        });
		
	}

	private getCompanies(): void {
		// this.companiesService.getCompanyDDOs().then(result => {
		// 	if (result) {
		// 	} else {
		// 		this.companies = result;
		// 		var obj = { CompanyID: 0, Number: 'None', CompanyName: 'None', Type: 'None', account_id: 0 };
		// 		// this.companies.splice(0, 0, obj);
		// 		// this.selectedCompany.selected = obj;
		// 	}
		this.getUserDetails();

		// });
	}
	private getUserDetails(): void {
		this.userService.getUserById(this.sessionDetails.userId).then(result => {
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
				if (result) {
					this.purchaseOrders = result;
				}
				this.getPaymentMethod();
			});

	}

	private getPaymentMethod(): void {
		this.paymentMethods = [];
		this.paymentMethods = [{ ID: 0, Name: 'Check' }];


		this.paymentMethods.forEach(item => {
			if (item.ID == 0) {
				this.selectedPaymentMethod.selected = item;
			}
		});

		this.getInvoiceID();
	}

	private getInvoiceID(): void {


		this.invoiceService.getInvoiceId(this.invSearchObject).then(result => {
			if (result) {
				this.invoiceIDs = result;

			}
			this.getInvoiceDetail();
		});
	}

	private getInvoiceDetail(): void {
		this.invoiceEntryService
			.getInvoiceDetail(this.InvoiceID, this.attachmentId).then(result => {
				if (result) {
					this.invoiceDetail = result;

				}


				if (this.invoiceDetail.InvoiceID == 0) {
					this.docType = 5;
					this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
					this.DocumentID = this.invoiceDetail.AttachmentID;
				} else {
					this.docType = 10;
					this.DocumentLockingID = this.invoiceDetail.DocumentLockingID
					this.DocumentID = this.invoiceDetail.InvoiceID;
				}



				this.vendorKey = this.invoiceDetail.VendorKey;
				var apiServiceBase = ApiUrl.baseUrl;
				this.pdfsrc1 = apiServiceBase + 'api/invoices/getPdf/' + this.invoiceDetail.CompanyNumber + '/' + this.invoiceDetail.AttachmentName;
				this.pdfsrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfsrc1);
				if (this.invoiceDetail.CashAccount != null) {
					this.cashAccount = this.invoiceDetail.SLCashAccount;
				}

				this.invoiceNumber = this.invoiceDetail.InvoiceNumber;
				if (this.invoiceID != 0) {
					this.invoiceDate = this.invoiceDetail.InvoiceDate;
					this.postGlDate = this.invoiceDetail.PostDate;
					this.dueDate = this.invoiceDetail.DueDate;
				}


				if (this.purchaseOrders) {
					this.purchaseOrders.forEach(item => {
						if (item.PuchaseOrderID == this.invoiceDetail.PurchaseOrderID) {
							this.poVendorKey = item.NumberKey;
							this.poNum = item.PONum;
							this.poInvDesc = item.InvoiceDescription;
							this.invoiceEntryService.getVendorById(this.invoiceDetail.CompanyID).then(result => {
								if (result) {
									this.vendors = result;
									this.vendors.forEach(item1 => {
										if (item1.VendorID == this.invoiceDetail.VendorID) {
											this.invoiceDetail.VendorName = item1.VendorName1;
											this.invoiceDetail.VendorAddress = item1.VendorAddress;
											this.invoiceDetail.VendorKey = item1.VendorKey;
											this.vendorKey = item1.VendorKey;
											this.dueDays = item1.DueDays;
											this.cashAccount = item1.CashAccount;
											this.achAcctName = item1.AchAcctName;

											if (this.achAcctName != null && this.achAcctName != "") {
												var item = { ID: 0, Name: this.achAcctName }

												this.paymentMethods.splice(1, 0, item);
												// this.selectedPaymentMethod.selected = [];
												// this.paymentMethods.forEach(function (item) {
												// 	if (item.ID == 1) {
												// 		this.selectedPaymentMethod.selected = item;
												// 	}
												// });
											}


										}
									});
								}

							});
						}

					});
				}
				this.getLedgerAccounts();
				//this.getCompanyDetail();

			});
	}

    private getCompanyDetail(CompanyID): void {
		this.invoiceEntryService
			.getCompanyDetail(CompanyID).then(result => {
				if (result) {
					this.companyData = result;

				}


				//         if ($rootScope.sessionDetails.IsSuperUser == false && this.companyData.view_invoice_role_id != 0) {
				//             if (this.User.selectedRoles != null && this.User.selectedRoles != undefined && this.User.selectedRoles.length > 0) {
				//                 for (var i = 0 ; i < this.User.selectedRoles.length ; i++) {
				//                     if (this.companyData.view_invoice_role_id == this.User.selectedRoles[i].RoleID) {
				//                         this.roleExistCount = this.roleExistCount + 1;
				//                     }

				//                 }
				//             }
				//             else {
				//                 window.location.href = "#/dashboard";
				//             }

				//             if (this.roleExistCount == 0) {
				//                 window.location.href = "#/dashboard";
				//             }

				//         }


				if (this.cashAccount == 49 && this.companyData.CashAccount1Description != 'Unknown') {
					this.Accountbind = 'AcDiscription1';

				}

				else if (this.cashAccount == 50 && this.companyData.CashAccount2Description != 'Unknown') {
					this.Accountbind = 'AcDiscription2';
				}

				else if (this.cashAccount == 51 && this.companyData.CashAccount3Description != 'Unknown') {
					this.Accountbind = 'AcDiscription3';

				}

				else if (this.cashAccount == 52 && this.companyData.CashAccount4Description != 'Unknown') {
					this.Accountbind = 'AcDiscription4';
				}
				else {
					if (this.companyData.CashAccount1Description != 'Unknown') {
						this.Accountbind = 'AcDiscription1';
					}
				}

				//     this.companyTooltip = $sce.trustAsHtml("<b>Ledger Accounts:</b> " + this.companyData.LedgerAccountCount + "<br /><b>Invoices:</b> " + this.companyData.InvoiceCount + "<br /><b>Vendors:</b> " + this.companyData.VendorCount + "<br /><b>PDFs:</b> " + this.companyData.PDFCount + "<br /><b>Purchase Orders:</b> " + this.companyData.PurchaseOrderCount + "<br /><b>Approval Criteria:</b> " + this.companyData.ApprovalCriteriaCount + "<br /><b>Posts:</b> " + this.companyData.FundCount + "<br />");
				// }
				this.getVendorByCompanyID();
			});

	}

	private getVendorByCompanyID(): void {
		var companyID = 0;
		if (this.invoiceDetail.CompanyID != null) {
			companyID = this.invoiceDetail.CompanyID;
		}
		this.invoiceEntryService.getVendorById(companyID).then(result => {
			if (result) {

				this.vendors = result;
				this.getJobs(this.invoiceDetail.CompanyID);
			}

		});
	}
	private getJobs(CompanyID): void {
		this.jobsService.getJobsByCompanyId(CompanyID).then(result => {
			if (result)
				this.jobs = result;

			if (this.invoiceDetail.JobID != null && this.invoiceDetail.JobID != 0) {
				this.selectedJob.selected = [];
				this.jobs.forEach(function (item) {
					if (item.JobID == this.invoiceDetail.JobID) {
						this.selectedJob.selected = item;
						this.JobID = item.JobID;
						this.getJobCategory(this.JobID);
					}
				});
			}


			// $rootScope.intervalPromise = $interval(function () {
			//     this.confirmLock();
			// }, 1 * 60000);

			//this.getInvoiceApprovals(this.invoiceDetail.InvoiceID, this.invoiceDetail.InvoiceAmount, this.invoiceDetail.CompanyID);


		});
	}

    private getJobCategory(jobID): void {
		this.jobsService.getJobCategory(jobID).then(result => {
			if (result) {

				this.jobCategory = result;
				this.invoiceDetail.JobID = jobID;
				this.jobCategory.forEach(item => {
					if (item.JobCategoryID == this.invoiceDetail.JobCategoryID) {
						this.selectedJobCategory.selected = item;

					}
				});
			}
		});

	}

	private addGlAccountByPopup(led) {
		this.invoiceDetail.InvoiceDistributions

		this.glAccountObject.glAccountNumber = led.LedgerAccountName;
		this.glAccountObject.glAccountDescription = this.invoiceDetail.Description;
		let fcs_description = true;

		if (this.invoiceDetail.InvoiceAmount == 0 || this.invoiceDetail.InvoiceAmount == null) {
			alert("Invoice Amount can not be Zero");
			return;
		}

		if (this.invoiceDetail.InvoiceDistributions.length == 0) {
			this.glAccountObject.glAccountAmount = this.invoiceDetail.InvoiceAmount;
		}
		else if (this.invoiceDetail.InvoiceDistributions.length > 0) {
			let totalDistAmount: number = this.glAccountObject.glAccountAmount;
			for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
				totalDistAmount = parseInt((Number(totalDistAmount) + Number(this.invoiceDetail.InvoiceDistributions[i].DistributionAmount)).toFixed(2));
			}
			if (this.invoiceDetail.InvoiceAmount != totalDistAmount) {
				this.glAccountObject.glAccountAmount = parseInt((Number(this.invoiceDetail.InvoiceAmount) - Number(totalDistAmount)).toFixed(2));
			}
		}

	}

	private addGlAccount(): void {
		let isMacthed = false;
		//this.glAccountObject = new GlAccountObject();
		this.invoiceEntryService
			.getLedgerAccountDDOsAccountTypeWise(this.invoiceDetail.CompanyID)
			.then(result => {
				if (result) {
                    this.ledgerAccounts = result;
					if (this.ledgerAccounts != null && this.ledgerAccounts.length > 0) {
						this.ledgerAccounts.forEach(item => {
							if (item.LedgerAccountName == this.glAccountObject.glAccountNumber) {
								isMacthed = true;
								// this.glAccountNumber = item.LedgerAccountName;
								if (this.invoiceDetail.InvoiceAmount == 0 || this.invoiceDetail.InvoiceAmount == null) {
									alert("Invoice Amount can not be Zero");
									return;
								}
								if (this.glAccountObject.glAccountAmount == 0 || this.glAccountObject.glAccountAmount == null) {
									alert("Distribution Amount can not be Zero");
									return;
								}
								else {
									this.GetSelectedLedgderAccounts(item);
								}

							}
						});

						if (isMacthed == false) {

							alert("No Account Number match with this Key");
						}

					}
                }

			});


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
			DistAmountPopoverUrl: "DistAmountPopover.html",
			DistCommentPopoverUrl: "DistCommentPopover.html"
		}



		if (this.invoiceDetail.InvoiceDistributions.length == 0) {
			if (parseFloat(item.DistributionAmount.toString()) > parseFloat(this.invoiceDetail.InvoiceAmount.toString())) {
				alert("Distribution amount can not be greater then Invoice amount ");
				return;
			}
		}
		else if (this.invoiceDetail.InvoiceDistributions.length > 0) {
			var totalDistAmount = (item.DistributionAmount.toString());
			for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
				totalDistAmount = (Number(totalDistAmount) + Number(this.invoiceDetail.InvoiceDistributions[i].DistributionAmount)).toFixed(2);
			}

			if ((Number(this.invoiceDetail.InvoiceAmount.toString)) < Number(totalDistAmount.toString())) {
				alert("Total Distribution amount can not be greater then Invoice amount ");
				return;
			}
		}
		this.invoiceDetail.InvoiceDistributions.splice(1, 0, item);
		this.isAddAccount = false;
		this.glAccountObject = new GlAccountObject();


	}

	private processInvAmtToDistribution(amt): void {
		if (this.invoiceDetail.InvoiceDistributions.length == 1) {
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
                        if (this.invoiceDetail.InvoiceID == 0 || this.invoiceDetail.InvoiceID == null) {
                            this.invoiceDetail.InvoiceNumber = 0;
                        }
						this.vendorKey = "";
                        this.invoiceDetail.VendorID = null;
                        this.invoiceDetail.VendorName = '';
                        this.invoiceDetail.VendorAddress = '';
                        this.invoiceDetail.VendorKey = '';
                        this.dueDays = 0;
                        this.cashAccount = null;
                        this.achAcctName = '';
                        this.AccountNumber = '';
                        this.invoiceDate = "";
                        this.dueDate = '';
                        this.postGlDate = '';

						alert("This Invoice Number with same vendor and same invoice date is  already exists in this property");
                    }
                });

		}


	}

    private checkPONumber(poNum, $event): void {

		var isMacthed = false;
		if (this.purchaseOrders != null && this.purchaseOrders.length > 0 && (poNum != null && poNum != '')) {
			this.purchaseOrders.forEach(item => {
				if (item.PONum.toLowerCase() == poNum.toLowerCase()) {
					isMacthed = true;
					this.GetSelectedPurchaseOrder(item.PuchaseOrderID);
				}
			});

			if (isMacthed == false) {
				this.poNum = "";
				this.invoiceDetail.PurchaseOrderID = null;
				this.poVendorKey = '';
				this.poInvDesc = '';
				this.invoiceDetail.InvoiceAmount = 0;
				alert("No PO Number match with this Key");
			}

		}



	}

	private checkVendorKey(vendorKey, $event): void {
		var isMacthed = false;
		if (this.vendors != null && this.vendors.length > 0 && (vendorKey != null && vendorKey != '')) {
			this.vendors.forEach(item => {
				if (item.VendorKey.toLowerCase() == vendorKey.toLowerCase()) {
					isMacthed = true;
					this.invoiceDetail.VendorID = item.VendorID;
					this.GetSelectedVendors(item.VendorID);
				}
			});

			if (isMacthed == false) {
				$event.target.select();
				this.vendorKey = "";
				this.invoiceDetail.VendorID = null;
				this.invoiceDetail.VendorName = '';
				this.invoiceDetail.VendorAddress = '';
				this.invoiceDetail.VendorKey = '';
				this.dueDays = 0;
				this.cashAccount = null;
				this.achAcctName = '';
				this.AccountNumber = '';
				alert("No Vendor Key match with this Key");
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
				if (this.invoiceDetail.InvoiceID == 0 || this.invoiceDetail.InvoiceID == null) {
					this.invoiceDetail.InvoiceNumber = 0;
				}
				this.vendorKey = "";
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
				alert("This Invoice Number with same vendor and same invoice date is  already exists in this property");
			} else {

				if (this.AccountNumber != null && this.AccountNumber != "") {
					if (this.invoiceDetail.InvoiceDistributions.length > 0) {
						for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
							if (this.invoiceDetail.InvoiceDistributions[i].AccountNumber == this.AccountNumber) {
								if (this.invoiceDetail.InvoiceDistributions[i].DistributionID == 0) {
									this.invoiceDetail.InvoiceDistributions.splice(i, 1);
								}
								else {
									this.invoiceService.removeInvoiceDistributions(this.invoiceDetail.InvoiceDistributions[i].DistributionID, this.invoiceDetail.InvoiceID).then(result => {
										this.invoiceDetail.InvoiceDistributions.splice(i, 1);
										this.ProcessVendor(this.invoiceDetail.InvoiceID);
										return;
									});
								}
							}
						}
					}
				}


				this.ProcessVendor(venID);
			}
		});
	}

	private GetSelectedPurchaseOrder(poID): void {
		// this.$parent.searchTerm = '';
		this.purchaseOrders.forEach(item => {
			if (item.PuchaseOrderID == poID) {
				this.invoiceDetail.PurchaseOrderID = poID;
				this.poVendorKey = item.NumberKey;
				this.poInvDesc = item.InvoiceDescription;
				this.invoiceDetail.InvoiceAmount = item.POAmount;
				this.poNum = item.PONum;
				var vendorID = item.VendorID;
				// check Account Number exist or not 
				if (this.AccountNumber != null && this.AccountNumber != "") {
					if (this.invoiceDetail.InvoiceDistributions.length > 0) {
						for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
							if (this.invoiceDetail.InvoiceDistributions[i].AccountNumber == this.AccountNumber) {
								if (this.invoiceDetail.InvoiceDistributions[i].DistributionID == 0) {
									this.invoiceDetail.InvoiceDistributions.splice(i, 1);
								}
								else {
									this.invoiceService.removeInvoiceDistributions(this.invoiceDetail.InvoiceDistributions[i].DistributionID, this.invoiceDetail.InvoiceID).then(result => {
										this.invoiceDetail.InvoiceDistributions.splice(i, 1);
										this.ProcessVendor(vendorID);
										return;
									});
								}
							}
						}
					}
				}

				this.ProcessVendor(vendorID);
			}
		});

	}

	private getLedgerAccounts(): void {
		this.invoiceEntryService
			.getLedgerAccountDDOsAccountTypeWise(this.CompanyID)
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
			if (item1.VendorID == vendorID) {
				this.invoiceDetail.VendorID = item1.VendorID;
				this.invoiceDetail.VendorName = item1.VendorName1;
				this.invoiceDetail.VendorAddress = item1.VendorAddress;
				this.invoiceDetail.VendorKey = item1.VendorKey;
				this.vendorKey = item1.VendorKey;
				this.dueDays = item1.DueDays;
				this.cashAccount = item1.CashAccount;
				this.achAcctName = item1.AchAcctName;
				this.AccountNumber = item1.AccountNumber;

				if (this.AccountNumber != null && this.AccountNumber != "") {

					this.ledgerAccounts.forEach(item2 => {
						if (item2.AccountNumber == this.AccountNumber) {


							var item = {
								DistributionID: 0,
								LedgerAccountID: item2.LedgerAccountID,
								InvoiceID: this.invoiceID,
								AccountNumber: item2.AccountNumber,
								AccountTitle: item2.LedgerAccount,
								AccountDestribution: 0,
								DistributionAmount: parseFloat(this.invoiceDetail.InvoiceAmount.toString()),
								DistributionComment: "Click to Comment",
								DistAmountPopoverUrl: "DistAmountPopover.html",
								DistCommentPopoverUrl: "DistCommentPopover.html"
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

	}
	private checkglAccountNumber(glAccountNumber, $event): void {
		var isMacthed = false;
		// this.fcs_AccountNum = true;
		if (this.ledgerAccounts.length > 0 && (glAccountNumber != null && glAccountNumber != '')) {
			this.ledgerAccounts.forEach(item => {
				if (item.LedgerAccountValue == glAccountNumber) {
					glAccountNumber = glAccountNumber + '-0000';
				}

				if (item.LedgerAccountName == glAccountNumber) {
					if (parseFloat(this.invoiceDetail.InvoiceAmount.toString()) == 0 || parseFloat(this.invoiceDetail.InvoiceAmount.toString()) == null) {
						alert("Invoice Amount can not be Zero");
					}
					isMacthed = true;
					this.glAccountObject.glAccountNumber = item.LedgerAccountName;
					this.glAccountObject.glAccountDescription = this.invoiceDetail.Description;

					if (this.invoiceDetail.InvoiceDistributions.length == 0) {
						this.glAccountObject.glAccountAmount = this.invoiceDetail.InvoiceAmount;
					}
					else if (this.invoiceDetail.InvoiceDistributions.length > 0) {
						var totalDistAmount = this.glAccountObject.glAccountAmount;
						for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
							totalDistAmount = parseFloat((totalDistAmount.toString())) + parseFloat((this.invoiceDetail.InvoiceDistributions[i].DistributionAmount.toString()));
						}

						if ((parseFloat(this.invoiceDetail.InvoiceAmount.toString())) != (totalDistAmount)) {
							//this.glAccountObject.glAccountAmount = ((parseFloat(this.invoiceDetail.InvoiceAmount)).toFixed(2) - (totalDistAmount).toFixed(2));
						}
					}

					this.fcs_description = true;
				}
			});

			if (isMacthed == false) {

				this.glAccountObject = new GlAccountObject();


				alert("No Account Number match with this Key");
			}

		}
	}

    private removeInvoiceDistributions(distID, $index): void {
		if (distID == 0) {
			this.invoiceDetail.InvoiceDistributions.splice($index, 1);
		}
		else {
			this.invoiceService.removeInvoiceDistributions(distID, this.invoiceDetail.InvoiceID).then(result => {
				this.invoiceDetail.InvoiceDistributions.splice($index, 1);
			});
		}
	}
	private checklockingStatusForExit(linkString): void {
		if (this.invoiceDetail.LockedByID == this.sessionDetails.userID) {
			this.unlockDocument(linkString)
		} else {
			this.router.navigate([linkString]);
		}


		//test
	}

	private setDueDateByInvoiceDate(): void {

		if (this.invoiceDate != '' && (moment(this.invoiceDate, 'MM/DD/YY', true))) {

			this.invoiceDate = moment(this.invoiceDate).format('MM/DD/YYYY');
			var date = new Date(this.invoiceDate);
			this.postGlDate = this.invoiceDate;
			var newdate = new Date(date.toDateString());

			newdate.setDate(newdate.getDate() + parseInt(this.dueDays));

			var dd = newdate.getDate();
			var mm = newdate.getMonth() + 1;
			var y = newdate.getFullYear();

			var someFormattedDate = mm + '/' + dd + '/' + y;

			if ((moment(someFormattedDate, 'MM/DD/YYYY', true).isValid())) {
				this.dueDate = someFormattedDate;
			} else {
				this.dueDate = '';
				this.invoiceDate = '';
				this.postGlDate = '';
			}

			this.checkInvoiceNumberExists(null);


		}
		else {
			this.dueDate = '';
			this.invoiceDate = '';
			this.postGlDate = '';
		}
	}

	private saveInvoice(value): void {
		// this.xyz = jQuery().find("#invoice_InvDate").val();
		// alert(this.xyz);

		this.masterService.checkLockedDocumentState(this.DocumentLockingID, this.docType, this.DocumentID).then(result => {
			if (result.IsLocked == 0) {
				alert("This pdf is locked by " + result.LockBy);
			} else {

				this.errors = [];
				this.errorHeader = '';
				if (this.invoiceDetail.InvoiceAmount == 0 || this.invoiceDetail.InvoiceAmount == null) {
					this.invoiceDetail.InvoiceAmount = 0;
				}

				this.ValidateInvoice();

				if (this.errors.length == 0) {

					if (this.invoiceDate != null && this.invoiceDate != "") {

						this.invoiceDetail.InvoiceDate = this.invoiceDate;

					}
					if (this.dueDate != null && this.dueDate != "") {
						this.invoiceDetail.DueDate = this.dueDate;
					}

					if (this.postGlDate != null && this.postGlDate != "") {
						this.invoiceDetail.PostDate = this.postGlDate;

					}

					if (this.Accountbind == 'AcDiscription1') {
						this.invoiceDetail.SLCashAccount = 49;
						this.invoiceDetail.CashAccountID = this.companyData.cash_account_1_id;
					}
					else if (this.Accountbind == 'AcDiscription2') {
						this.invoiceDetail.SLCashAccount = 50;
						this.invoiceDetail.CashAccountID = this.companyData.cash_account_2_id;
					}
					else if (this.Accountbind == 'AcDiscription3') {
						this.invoiceDetail.SLCashAccount = 51;
						this.invoiceDetail.CashAccountID = this.companyData.cash_account_3_id;
					}
					else if (this.Accountbind == 'AcDiscription4') {
						this.invoiceDetail.SLCashAccount = 52;
						this.invoiceDetail.CashAccountID = this.companyData.cash_account_4_id;
					}
					else {
						this.invoiceDetail.SLCashAccount = 49;
						this.invoiceDetail.CashAccountID = this.companyData.cash_account_1_id;
					}


					// if (editstate == 'saveInvoiceAfterEditFromBatch') {
					// 	this.invoiceDetail.InvoiceStatusID = 1;
					// 	this.invoiceDetail.ExpeditedID = null;
					// 	this.invoiceDetail.ExpeditedDate = null;
					// }


					this.invoiceService.getNextAttachmentIDs(this.attachmentId).then(result1 => {
						this.invoiceService.saveInvoice(this.invoiceDetail).then(result => {
							if (result) {
							}
							// else if (result.status == 500) {
							//     this.showHideErrorLog = { 'display': 'none' };
							//     this.displayValue = 'none';
							//     alert("error", result.data.Message, "error");
							// }
							else {
								// if ($rootScope.intervalPromise != undefined) {
								//     $interval.cancel($rootScope.intervalPromise);
								// }
								this.displayValue = 'none';
								this.invoiceAlert = '';

								if (value == 'isSaveAndContinue') {
									if (result1.data == null || result1.data == 0 || result1.data == "" || result1.data == "0" || result1.data == "null") {
										alert("Invoice saved successfully");
										this.unlockDocument('/attachmentsList/' + this.pageSizeFilter + '/-1');
									}
									else {
										alert("Invoice saved successfully");

										//$anchorScroll('invoiceentryview');
										this.NextAttchID = result1;
										this.unlockDocument('/invoices/' + this.pageSizeFilter + '/' + this.searchParameters + '/' + this.invoiceID + '/new/' + parseInt(this.NextAttchID));
									}
								}
								if (value == 'isSave') {
									alert("Invoice saved successfully");
									this.unlockDocument('/invoices/' + this.pageSizeFilter + "/" + this.searchParameters + '/' + parseInt(result.data) + '/' + null + '/' + 0 + '/' + 0 + '/' + 0 + '/' + 0);

								}
								if (value == 'isSaveAfterEdit' || value == 'isExpedited' || value == 'isSubmitforApproval') {
									alert("Invoice saved successfully");
									this.unlockDocument('/dashboard');
								}

								if (value == 'getInvoiceGrid') {
									alert("Invoice saved successfully");
									this.unlockDocument('/invoicesList/' + +this.pageSizeFilter + '/' + this.searchParameters);
								}
							}
						});
					});
				}
			}
		});
	}

	private unlockDocument(linkString): void {
		this.documentType = 5;
		this.doctype = 'Attachment';
		this.documentID = 0;
		if (this.invoiceDetail.InvoiceID == 0) {
			this.documentType = 5;
			this.documentID = this.invoiceDetail.AttachmentID;
			this.doctype = 'Attachment';
		} else {
			this.documentType = 10;
			this.documentID = this.invoiceDetail.InvoiceID;
			this.doctype = 'Invoice';

		}

		this.masterService.unlockDocument(this.documentID, this.sessionDetails.userId, this.documentType).then(result => {
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
		}
		else {
			if (status == 'isSubmitforApproval') {
				alert("Invoice amount is zero.so can not submit this invoice for approval");
				return;
			}

			if (status == 'isExpedited') {
				alert("Invoice amount is zero.so can not expedite this invoice");
				return;
			}
		}
	}
	private ValidateInvoice(): void {
		this.errors = [];
		if (this.invoiceDetail.InvoiceNumber == null) {
			var obj = { ErrorName: "Invoicenumber can't be blank" }
			this.invoiceAlert = { 'border': '1px solid red' };
			this.errors.splice(this.errors.length, 0, obj);
		}

		if (this.invoiceDetail.VendorID == null) {
			var obj = { ErrorName: "Vendor can't be blank" }
			this.errors.splice(this.errors.length, 0, obj);
		}

		if (this.invoiceDate == "" || this.invoiceDate == null) {
			var obj = { ErrorName: "InvoiceDate can't be blank" }
			this.errors.splice(this.errors.length, 0, obj);
		}

		if (this.invoiceDate != "" && this.invoiceDate != null) {
			var isValid = moment(this.invoiceDate, 'MM/DD/YYYY', true).isValid()
			if (isValid == false) {
				var obj = { ErrorName: "Invoice Date format is wrong" }
				this.errors.splice(this.errors.length, 0, obj);
			}
		}


		if (this.postGlDate == "" || this.postGlDate == null) {
			var obj = { ErrorName: "Post GL Date can't be blank" }
			this.errors.splice(this.errors.length, 0, obj);
		}


		if (this.postGlDate != "" && this.postGlDate != null) {
			var isValid = moment(this.postGlDate, 'MM/DD/YYYY', true).isValid()
			if (isValid == false) {
				var obj = { ErrorName: "postGlDate format is wrong" }
				this.errors.splice(this.errors.length, 0, obj);
			}
		}

		if (this.dueDate == "" || this.dueDate == null) {
			var obj = { ErrorName: "DueDate can't be blank" }
			this.errors.splice(this.errors.length, 0, obj);
		}

		if (this.dueDate != "" && this.dueDate != null) {
			var isValid = moment(this.dueDate, 'MM/DD/YYYY', true).isValid()
			if (isValid == false) {
				var obj = { ErrorName: "Due Date format is wrong" }
				this.errors.splice(this.errors.length, 0, obj);
			}
		}


		if (this.invoiceDetail.JobID != 0 && this.invoiceDetail.JobID != null) {
			if (this.invoiceDetail.JobCategoryID == 0 || this.invoiceDetail.JobCategoryID == null) {
				var obj = { ErrorName: "job category can't be blank" }
				this.errors.splice(this.errors.length, 0, obj);
			}
		}

		for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
			if (this.invoiceDetail.InvoiceDistributions[i].DistributionAmount == 0
				|| this.invoiceDetail.InvoiceDistributions[i].DistributionAmount == 0.00) {
				var obj = { ErrorName: "Distributions amount can not be zero.please enter the amount" }
				this.errors.splice(this.errors.length, 0, obj);
			}
		}


		if (this.invoiceDetail.InvoiceAmount != null) {
			var totalAmount = 0.00;
			if (this.invoiceDetail.InvoiceDistributions.length > 0) {
				for (var i = 0; i < this.invoiceDetail.InvoiceDistributions.length; i++) {
					if (this.invoiceDetail.InvoiceDistributions[i].DistributionAmount == 0) {
						this.invoiceDetail.InvoiceDistributions[i].DistributionAmount = 0.00;
					}
					totalAmount = (totalAmount + this.invoiceDetail.InvoiceDistributions[i].DistributionAmount);
				}
			}

			if ((Number(this.invoiceDetail.InvoiceAmount)) != (totalAmount)) {
				var obj = { ErrorName: "Invoice amount and total distribution amount are not equal" };
				this.errors.splice(this.errors.length, 0, obj);
			}
		}


		if (this.errors.length > 0) {
			this.displayValue = 'alert alert-danger';
			this.errorHeader = this.errors.length + ' errors prohibited this inovice from being saved:';
			//$(window).scrollTop(0);
			return;
		}



	}
}



