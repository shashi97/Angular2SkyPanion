export class LedgerAccountModel {
    LedgerAccountGridArray: Array<LedgerAccountRow> = [];
    constructor() {
        this.LedgerAccountGridArray = new Array<LedgerAccountRow>();
    }
}

export class LedgerAccountRow {
    AccountCategory: number = 0;
    AccountLevel: number = 0;
    AccountNumber: number = 0;
    AccountTitle: string = '';
    AccountType: number = 0;
    Active: string = '';
    Amount1: number = 0;
    Amount2: number = 0;
    Amount3: number = 0;
    Amount4: number = 0;
    Amount5: number = 0;
    CompanyName: string = '';
    Department: string = '';
    Division: string = '';
    ExtractStatus: number = 0;
    LedgerAccountName: string = '';
    PrintColumn: number = 0;
    RowNumber: number = 0;
    Spare: string = '';
    SubAcct: string = '';
    TotalCount: number = 0;
    company_id: number = 0;
    created_at: string = '';
    id: number = 0;
    invCount: string = '';
    updated_at: string = '';
    updated_by_id: null

    constructor(serverResponse) {
        if (serverResponse) {
            Object.assign(this, serverResponse);
        }
    }
}


export class LedgerAccountDetail {
    ledgerAccountDistributions: Array<any> = [];
}