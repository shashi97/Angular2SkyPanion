export class CompaniesModel {
  companiesDetail: Array<CompanyInfo> = [];
  constructor() {
    this.companiesDetail = new Array<CompanyInfo>();
  }
}

export class CompanyInfo {
  ActivationLink: string;
  Active: boolean;
  ApprovalCriteriaCount: number;
  CompanyCount: number;
  CompanyID: number;
  FundCount: number;
  InvoiceCount: number;
  LedgerAccountCount: number;
  Name: string;
  Number: string;
  PDFCount: number;
  PurchaseOrderCount: number;
  RowNumber: number;
  Sync: string;
  ToolTipTypeText: string;
  VendorCount: number;
  account_id: number;
  type: string;
  status?: number;
}

export class CompanyDetails {

  APDescription: string;
  AccountName: string;
  AchSetupCount: string;
  Active: boolean;
  ApprovalCriteriaCount: number;
  CashAccount1Description: string;
  CashAccount2Description: string;
  CashAccount3Description: string;
  CashAccount4Description: string;
  CompNameOnChecks: string;
  CompanyID: number;
  CompanyName: string;
  CompanyNameCheck1: string;
  CompanyNameCheck2: string;
  DbName: string;
  DiscountDescription: string;
  FundCount: number;
  InvoiceCount: number;
  LedgerAccountCount: number;
  Number: string;
  OneRec: string;
  PDFCount: number;
  POCount: number;
  PdfFolderPath: string;
  PrePaidDescription: string;
  ShowAcctsOnStub: string;
  ShowPropOnStub: string;
  SyncEnabled: string;
  VendorCount: number;
  account_id: number;
  ap_account_id: string;
  approve_invoice_role_id: number;
  approver_override_role_id: number;
  batch_invoice_role_id: number;
  cash_account_1_id: string;
  cash_account_2_id: string;
  cash_account_3_id: string;
  cash_account_4_id: string;
  create_invoice_role_id: number;
  delete_invoice_role_id: number;
  discount_account_id: string;
  pre_paid_account_id: string;
  review_invoice_role_id: number;
  type: string;
  view_invoice_role_id: number;
  status ?: number;
}
