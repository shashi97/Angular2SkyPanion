

export class ApprovalCriteriaModel {
    approvalCriteriaGridArray: Array<ApprovalCriteriaRow> = [];
    constructor() {
        this.approvalCriteriaGridArray = new Array<ApprovalCriteriaRow>();
    }
}




export class ApprovalCriteriaRow {
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