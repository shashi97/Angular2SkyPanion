

export class ApprovalCriteriaModel {
    AccountID: number = 0;
    AccountNumber: number = 0;
    AccountTitle: number = 0;
    ApprovalCount: number = 0;
    ApprovalCriteria: string = '';
    ApprovalCriteriaID: number = 0;
    ApprovalType: string = '';
    CompanyID: number = 0;
    CompanyName: string = '';
    LedgerAccountID: number = 0;
    RangeEnd_cents: string = '';
    RangeEnd_currency: string = '';
    RangeStart_cents: string = '';
    RangeStart_currency: string = '';
    RowNumber: number = 0;
    UserID: number = 0;
    UserName: string = '';
    Weight: number = 0;
}

export class ApproversModel {
AccountName: string= '';
DisabledAt: number= 0;
name: string = '';
Picture: string= '';
UserID: number =  0;
UserType: string= '';
account_id: number = 0;
email: string= '';
owner_id: number= 0;
username: string= 'Select approvers';
label: string= '';
}
