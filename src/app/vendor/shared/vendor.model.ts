
import { VendorDistributionModel } from './vendor-accounts.model';

export class VendorModel {
  RowNumber: number;
  LedgerAccountId: number = null;
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
  glAccount:VendorDistributionModel = new VendorDistributionModel();
  company_id: number;
  CompanyName: string;
  VendorsCount: number;
}