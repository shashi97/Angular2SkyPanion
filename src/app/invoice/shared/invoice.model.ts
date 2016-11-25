
export class InvoiceModel {
  Attachment: string = '';
  AttachmentName: string = '';
  ClerkID: number = 0;
  CompanyID: number = 0;
  CompanyNumber: string = '';
  DistributionMessage: string = null;
  Distributions: string = '';
  InvoiceAmount: number = 0;
  InvoiceCount: number = 0;
  InvoiceDescription: string = '';
  InvoiceDistributions: Array<any> = [];
  InvoiceID: number = 0;
  InvoiceNumber: string = '';
  InvoiceStatus: string = '';
  IsLocked: string = null;
  LedgerAccountID: number = 0;
  LockedBy: string = null;
  LockedByID: string = null;
  PaidStatus: string = '';
  Processed: string = '';
  Type: string = '';
  VendorID: number = 0;
  VendorKey: string = '';
  VendorName: string = '';
}