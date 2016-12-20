
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
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
    AccountName: string = '';
    DisabledAt: number = 0;
    name: string = '';
    Picture: string = '';
    UserID: number = 0;
    UserType: string = '';
    account_id: number = 0;
    email: string = '';
    owner_id: number = 0;
    username: string = 'Select approvers';
    label: string = '';
}

export class LedgersModel {
    AccountNumber: string = '';
    AccountTitle: string= '';
    AccountType: string= '';
    LedgerAccount: string= 'select Ledger';
    LedgerAccountID: number= 0;
    LedgerAccountName: string= '';
    LedgerAccountValue: string= '';
    SubAcct: string= '';
    account_id: number= 0;
    company_id: number= 0;
}

export class ApprovalContext extends BSModalContext {
  approvalDetail: ApprovalCriteriaModel;
  type: string= '';
  isNew: number= 0;
  companyId: number= 0;
  approvers: Array<any> = []; /* declare it any because 
                            to bind data in dropdown we need to redine array 
                            in 'label' and 'value' */
  approversCount: number = 0;
  cmpName: string = '';
  ledgerAccounts: Array<any> = [];
  modelHeader: string= '';
  userName: string= '';
  ledgerAccountID: number= 0;
  rangeStart: string= '';
  rangeEnd: string= '';
  divAddApprover: boolean = false;
  rangeAmtError: boolean = false;
  approvalCriteriaID: number= 0;
  userID: number= 0;
}
