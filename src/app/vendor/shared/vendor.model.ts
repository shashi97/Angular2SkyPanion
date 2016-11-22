export class VendorModel {
  vendorGridArray: Array<VendorRow> = [];
  constructor() {
    this.vendorGridArray = new Array<VendorRow>();
  }
}

export class VendorRow {
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

export class VendorDetail {
  AccountNumber: string = '';
  Address: string = '';
  CompanyID: number = 0;
  LegalName: string = '';
  Memo: string = '';
  PhoneNumber: string = '';
  TaxId: number = 0;
  VendorID: number = 0;
  VendorInvoices: Array<any> = [];
  VendorKey: string = '';
  VendorName: string = '';
  WebSite: string = '';
  account_id: number = 0;
  glAccount: any;
}