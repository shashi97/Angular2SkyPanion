
export class AttachmentObject {
    AttachedTo_id: number = 0;
    AttachmentCount: number = 0;
    AttachmentID: number = 0;
    CompanyID: number = 0;
    Filesize: number = 0;
    LockedByID: number = 0;
    RowNumber: number = 0;
    UpdatedBy_id: number = 0;
    account_id: number = 0;
    rejected_by_id: number = 0;
    remote_sync_id: number = 0;
    Active: string = '';
    AttachedTo_type: string = '';
    CompanyName: string = '';
    CompanyNameOnly: string = '';
    CompanyNumber: string = '';
    Filename: string = '';
    Info: string = '';
    IsLocked: string = '';
    IsProcessLinkDisbale: string = '';
    LockedBy: string = '';
    Name: string = '';
    RejectedDate: string = '';
    RejectionMemo: string = '';
    companyName: string = '';
    uploaded: string = '';
    ViewInvoiceLink: string = '';
    type: string = '';

}
export class attachmentdata{
    status:string = '';
    type:string = '';
    companyName:string = '';
    attachmentID:string = '';
    accountID:string = '';
    uploaded:string = '';
    rejectionMemo:string = '';
    companyID:number = 0;
    fileName:string = '';
    companyNumber:number = 0;
    IsGeneralPdf:boolean;
    
}

