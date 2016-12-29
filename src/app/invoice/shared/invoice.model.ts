
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
  DocumentLockingID: number = 0;
  AttachmentID: number = 0;
  InvoiceStatusID: number = 0;
  docType: number = 0;
  IsInoiveSelected:boolean;
  TotalDistributionAmount: number = 0;
}
export class InvApprovals {
 InvoiceApprovals:Array<any>;
  OwnerName: string = '';
  AccountID: number = 0;
  OwnerID: number = 0;
 
}


