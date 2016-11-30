export class PurchaseOrderModel {
    PuchaseOrderID: number;
    VendorID: number;
    VendorName: string;
    InvoiceDescription : string;
    RequestedBy: string;
    AccountID: number;
    TotalCount: number;
    PONum : string;
    CompanyID:number;
    CompanyName : string;
    DscDate: string;
    DscAmount :number;
    DscAmount_currency : string;
    JobCategories: Array<any> = [];
}

