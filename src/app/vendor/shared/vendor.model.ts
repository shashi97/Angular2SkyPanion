export class VendorModel {
  vendorGridArray: Array<VendorDetail> = [];
  constructor() {
    this.vendorGridArray = new Array<VendorDetail>();
  }
}

export class VendorDetail {
  AccountNumber: string;
  CompanyName: string;
  LedgerAccountId: number = null;
  PhoneNumber: string;
  RowNumber: number;
  VendorID: number;
  VendorKey: string;
  VendorName: string;
  VendorsCount: number;
  account_id: number;
  company_id: number;
}
