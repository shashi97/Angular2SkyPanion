
export class PurchaseOrder {
    AccountID: number = 0;
    InvoiceDescription: string = "";
    POAmount: number = 0;
    PONum: string = "";
    PuchaseOrderID: number = 0;
    RequestedBy: number = 0;
    VendorID: number = 0;
    NumberKey: string = '';
    AttachedTo_type: string = '';
    VendorName: string = '';
    VendorKey: string = '';
}

export class LedgerAccounts {
    AccountNumber: string = '';
    AccountTitle: string = '';
    AccountType: string = '';
    LedgerAccount: string = '';
    LedgerAccountID: number = 0;
    LedgerAccountName: string = '';
    LedgerAccountValue: string = '';
    SubAcct: string = '';
    account_id: number = 0;
    company_id: number = 0;
}
export class GlAccountObject {
    glAccountNumber: string = '';
    glAccountAmount: number = 0;
    glAccountDescription: string = '';
}
export class invSearchObject {
    invoiceID: string = '';
    invoiceNumber: string = '';
    vendorID: number = 0;
    companyID: number = 0;
    statusID: string = '';
    userID: number = 0;
}
export class JobCategory {
    Category: string = '';
    invoiceNumber: string = '';
    CurrBudget_currency: string = '';
    CurrCost_currency: string = '';
    Description: string = '';
    OrigBudget_currency: string = '';
    AccountID: number = 0;
    CurrBudget_cents: number = 0;
    CurrCost_cents: number = 0;
    JobCategoryID: number = 0;
    JobID: number = 0;
    OrigBudget_cents: number = 0;
    Spare: number = 0;
    TotalCount: number = 0;

}


export class InvoiceExistItems {

    InvoiceNumber: number = 0;
    VendorID: number = 0;
    CompanyID: number = 0;
    InvoiceID: number = 0;
    invoiceDate: string = '';
}

export class Vendors {
    AccountID: number = 0;
    AccountNumber: string = "";
    AchAcctName: string = "";
    CompanyID: number = 0;
    VendorID: number = 0;
    AchAcctType: string = '';
    CashAccount: string = '';
    DueDays: string = '';
    VandorName: string = '';
    VendorAddress: string = '';
    VendorKey: string = '';
    VendorName1: string = '';

}
export class InvoiceDetail {
    ApprovedAt: number = 0;
    ApproverID: number = 0;
    ApproverName: number = 0;
    AttachedTo_id: number = 0;
    AttachmentID: number = 0;
    BatchDate: number = 0;
    BatchNumber: number = 0;
    BatchedByID: number = 0;
    BatchedDate: number = 0;
    BillToOccupant: number = 0;
    CashAccount: number = 0;
    CashAccountID: string= '';
    CheckDate: number = 0;
    CheckNumber: number = 0;
    Comment: number = 0;
    CompanyID: number = 0;
    DeletedByID: number = 0;
    DeletedDate: number = 0;
    Description: string = '';
    DistributionFlag: number = 0;
    DocumentLockingID: number = 0;
    DueDate: string = '';
    ExpeditedDate: number = 0;
    ExpeditedID: number = 0;
    ExternalOrigin: number = 0;
    ExtractStatus: number = 0;
    Frequency: number = 0;
    InvoiceAmount: number = 0;
    InvoiceDate: string = '';
    InvoiceID: number = 0;
    InvoiceNumber: number = 0;
    InvoiceSource: number = 0;
    InvoiceStatus: number = 0;
    InvoiceStatusID: number = 0;
    IsApprovalRequired: number = 0;
    IsBatche: number = 0;
    IsExpedited: number = 0;
    IsExpeditedable: number = 0;
    IsInvoiceDelete: number = 0;
    IsInvoiceOverride: number = 0;
    IsInvoiceReject: number = 0;
    IsLocked: number = 0;
    IsSubmitForApprovalRequired: number = 0;
    IsSubmitforApproval: number = 0;
    JobCategory: number = 0;
    JobCategoryID: number = 0;
    JobID: number = 0;
    JobNumber: number = 0;
    LockedByID: number = 0;
    Memo: number = 0;
    Name: number = 0;
    Notes: number = 0;
    POName: number = 0;
    PaidAmount: number = 0;
    PaidFlag: number = 0;
    PaidStatus: number = 0;
    PayUsingAch: number = 0;
    PmtSelFlag: number = 0;
    PostDate: string = '';
    ProcessedBy: number = 0;
    ProcessedByID: number = 0;
    ProcessedOn: number = 0;
    PurchaseOrder: number = 0;
    PurchaseOrderID: number = 0;
    RecurringFlag: number = 0;
    RejectedAt: number = 0;
    RejectedBy: number = 0;
    RejectedByID: number = 0;
    RejectedDate: number = 0;
    RejectionComment: number = 0;
    ReviewedDate: number = 0;
    ReviewerID: number = 0;
    SLCashAccount: number = 0;
    SeperateCheck: number = 0;
    SyncbatchID: number = 0;
    TennantBack: number = 0;
    TennantBackNote: number = 0;
    TotalDistributionAmount: number = 0;
    Unique: number = 0;
    UnitRefNumber: number = 0;
    VendorAddress: string = '';
    VendorID: number = 0;
    VendorKey: string = '';
    VendorName: string = '';
    VoucherLastKey: number = 0;
    VoucherNumber: number = 0;
    AttachedToType: string = '';
    AttachmentName: string = '';
    CompanyName: string = '';
    CompanyNumber: string = '';
    FileName: string = '';
    LockedBy: string = '';
    type: string = '';
    InvoiceDistributions: Array<InvoiceDistributions> = new Array<InvoiceDistributions>();

}
export class InvoiceDistributions {
    DistributionAmount: number = 0;
    AccountNumber: string = ''
    DistributionID: number = 0;

}

export class CompanyData {
    AchSetupCount: number = 0;
    Active: number = 0;
    ApprovalCriteriaCount: number = 0;
    CompanyID: number = 0;
    FundCount: number = 0;
    InvoiceCount: number = 0;
    LedgerAccountCount: number = 0;
    PDFCount: number = 0;
    POCount: number = 0;
    VendorCount: number = 0;
    account_id: number = 0;
    approve_invoice_role_id: number = 0;
    approver_override_role_id: number = 0;
    batch_invoice_role_id: number = 0;
    create_invoice_role_id: number = 0;
    delete_invoice_role_id: number = 0;
    review_invoice_role_id: number = 0;
    view_invoice_role_id: number = 0;
    APDescription: string = '';
    AccountName: string = '';
    CashAccount1Description: string = '';
    CashAccount2Description: string = '';
    CashAccount3Description: string = '';
    CashAccount4Description: string = '';
    CompNameOnChecks: string = '';
    CompanyName: string = '';
    CompanyNameCheck1: string = '';
    CompanyNameCheck2: string = '';
    DbName: string = '';
    DiscountDescription: string = '';
    Number: string = '';
    OneRec: string = '';
    PdfFolderPath: string = '';
    PrePaidDescription: string = '';
    ShowAcctsOnStub: string = '';
    ShowPropOnStub: string = '';
    SyncEnabled: string = '';
    ap_account_id: string = '';
    cash_account_1_id: string = '';
    cash_account_2_id: string = '';
    cash_account_3_id: string = '';
    cash_account_4_id: string = '';
    discount_account_id: string = '';
    pre_paid_account_id: string = '';
    type: string = '';

}

