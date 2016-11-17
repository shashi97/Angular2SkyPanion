export class CompaniesModel {
    companiesDetail: Array<CompanyInfo>=[];
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
   
}