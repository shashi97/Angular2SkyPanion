export class VendorModel {

  vendorsDetail: Array<VendorInfo> = [];
  constructor() {
    this.vendorsDetail = new Array<VendorInfo>();

  }
}

export class VendorInfo {

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

  constructor() {

  }
}