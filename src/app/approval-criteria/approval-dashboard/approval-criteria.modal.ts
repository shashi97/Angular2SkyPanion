import { Component, Output, EventEmitter , OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ApproversModel, ApprovalContext, LedgersModel } from '../shared/approval-criteria.model';
import { LedgerAccountService } from '../../ledger-account/shared/ledger-account.service';
import { ApprovalCriteriaService } from '../shared/approval-criteria.service';
import { LedgerAccountModel } from '../../ledger-account/shared/ledger-account.model';
import { OrderByPipe,CurrencyPipe } from '../../shared/pipe/orderby';
import { CurrencyFormatterDirective } from '../../shared/directive/showOnRowHover';


@Component({
  selector: 'sp-approval-modal',
  templateUrl: './approval-criteria.modal.html',
  providers:
        [CurrencyPipe,
          CurrencyFormatterDirective]
})

export class ApprovalModalComponent implements CloseGuard, ModalComponent<ApprovalContext> , OnInit {
  private approvalContext: ApprovalContext = new ApprovalContext();
  private errors: Array<Object> = [];
  private errorHeader: string;
  private selectedLedgerAccount: LedgerAccountModel = new LedgerAccountModel();
  private selectedApprover: ApproversModel = new ApproversModel();
  private showHideErrorLog: Object = { 'display': 'none' };
   private pattern='';
  constructor(public dialog: DialogRef<ApprovalContext>,
    public ledgerAccountService: LedgerAccountService,
    public approvalCriteriaService: ApprovalCriteriaService,
    public toastr: ToastsManager) {
    this.approvalContext = dialog.context;
    let temp = this.approvalContext.approvers;
    this.pattern = '/06([0-9]{8})/';
    this.approvalContext.approvers = [];
    temp.map((item: any) => {
      this.approvalContext.approvers.push(
        { label: item.username, value: item });
    });
    
  }

   ngOnInit() {
      setTimeout(() => {
      this.showApprovalCriteria(this.approvalContext.approvalDetail, this.approvalContext.isNew);
    }, 100);
  }



  public showApprovalCriteria(approvalDetail, isNew): void {
    let companyId = this.approvalContext.companyId === 0 ? approvalDetail.CompanyID : this.approvalContext.companyId;
    this.ledgerAccountService.getLedgerAccountDDOsAccountTypeWise(companyId).then((result) => {
      this.approvalContext.ledgerAccounts = result;
      let defaultLedger = new LedgersModel();
      this.approvalContext.ledgerAccounts.splice(0, 0, defaultLedger);
      let temp = this.approvalContext.ledgerAccounts;
      this.approvalContext.ledgerAccounts = [];
      temp.map((item: any) => {
        this.approvalContext.ledgerAccounts.push(
          { label: item.LedgerAccount, value: item });
      });
      this.showApprovalCriteriaReport(approvalDetail, isNew);
    });

  }

  private showApprovalCriteriaReport(result, isNew): void {
    this.approvalContext.rangeAmtError = false;
    if (isNew === 1) {
      if (this.approvalContext.approversCount > 0) {
        this.AddEditApproverCriteria(result);
      } else {
        this.approvalContext.divAddApprover = false;
        this.toastr.error('There are no user accounts with the'
          + 'permission required to approve invoices.Please go to the settings page to configure permissions', 'Oops!');
        return;
      }
    } else {
      this.approvalContext.divAddApprover = true;
      this.AddEditApproverCriteria(result);
    }
  }

  private AddEditApproverCriteria(result): void {
    this.approvalContext.divAddApprover = true;
    this.errorHeader = '';

    this.approvalContext.approvalCriteriaID = 0;

    this.approvalContext.rangeStart = '0';
    this.approvalContext.rangeEnd = '0';

    if (result === 'RangeApproval' && this.approvalContext.type === 'range') {
      this.approvalContext.modelHeader = 'Create Range Approval';
    } else if (result === 'ledgerApproval' && this.approvalContext.type === 'ledger') {
      this.approvalContext.modelHeader = 'Create Ledger Account Approval';
    } else {
      this.approvalContext.modelHeader = 'Edit Range Approval';
      this.approvalContext.approvalCriteriaID = result.ApprovalCriteriaID;
      this.approvalContext.cmpName = result.CompanyName;

      this.approvalContext.userID = result.UserID;
      this.approvalContext.userName = result.UserName;

      this.approvalContext.rangeStart = result.RangeStart_cents;
      this.approvalContext.rangeEnd = result.RangeEnd_cents;
      this.approvalContext.ledgerAccountID = result.LedgerAccountID === null ?
        this.approvalContext.ledgerAccountID : result.LedgerAccountID;
      if (this.approvalContext.companyId !== 0) {
        this.approvalContext.approvers.forEach((item) => {
          if (item.value.UserID === this.approvalContext.userID) {
            this.selectedApprover = item.value;
          }
        });

        if (this.approvalContext.type === 'ledger' || this.approvalContext.ledgerAccountID !== 0) {
          this.approvalContext.ledgerAccounts.forEach((item) => {
            if (item.value.LedgerAccountID === this.approvalContext.ledgerAccountID) {
              this.selectedLedgerAccount = item.value;
            }
          });
        }
      } else {
        if (this.approvalContext.ledgerAccountID !== 0) {
          this.approvalContext.ledgerAccounts.forEach((item) => {
            if (item.value.LedgerAccountID === this.approvalContext.ledgerAccountID) {
              this.selectedLedgerAccount = item.value;
            }
          });
        }
      }
    }
  }

  private changeApprover(selectedApprover): void {
  }

  private saveApprovalCriteria(): void {
    this.errors = [];
    this.errorHeader = '';
    let ledgerAccountID = 0;
    if (this.approvalContext.type === 'ledger') {
      if (this.selectedLedgerAccount.LedgerAccountID === 0) {
        let obj = { ErrorName: 'Please select Ledger Account' };
        this.errors.splice(this.errors.length, 0, obj);
      } else {
        ledgerAccountID = this.selectedLedgerAccount.LedgerAccountID;
      }
    } else {
      if (this.approvalContext.ledgerAccountID !== 0) {
        ledgerAccountID = this.selectedLedgerAccount.LedgerAccountID;
      }
    }

if ((this.approvalContext.type === '' || this.approvalContext.type === 'range') && this.approvalContext.ledgerAccountID === 0) {

  if (this.approvalContext.rangeStart === '') {
    let obj = { ErrorName: 'Please enter Range Start' };
    this.errors.splice(this.errors.length, 0, obj);
  }

  if (this.approvalContext.rangeEnd === '') {
    let obj = { ErrorName: 'Please enter Range End' };
    this.errors.splice(this.errors.length, 0, obj);
  }

  if (Number(this.approvalContext.rangeStart.replace(/[^0-9\.]+/g,""))
    > Number(this.approvalContext.rangeEnd.replace(/[^0-9\.]+/g,"")) ) {
    let obj = { ErrorName: 'Range Start cannot exceed Range End' };
    this.errors.splice(this.errors.length, 0, obj);
  }
}


if (this.approvalContext.companyId !== 0 && this.selectedApprover.UserID === 0) {
  let obj = { ErrorName: 'Please select Approver' };
  this.errors.splice(this.errors.length, 0, obj);
} else {
  this.approvalContext.userID = this.selectedApprover.UserID;
}

if (ledgerAccountID === 0
  && (this.approvalContext.type === 'ledger' || this.approvalContext.type === '')
  && (this.approvalContext.ledgerAccountID !== 0)) {
  let obj = { ErrorName: 'Please select Ledger Account' };
  this.errors.splice(this.errors.length, 0, obj);
}

if (this.errors.length > 0) {
  this.showHideErrorLog = { 'display': 'block' };
  this.errorHeader = this.errors.length + ' errors prohibited this range approval from being saved:';
  return;
}
this.approvalCriteriaService.saveApprovalCriteria(
  this.approvalContext.approvalCriteriaID,
  this.approvalContext.companyId,
  this.approvalContext.rangeStart,
  this.approvalContext.rangeEnd,
  this.approvalContext.userID,
  ledgerAccountID,
  this.approvalContext.type)
  .then((result) => {
    if (this.approvalContext.type === '') {
      this.approvalContext.type = 'all';
    }
    this.showHideErrorLog = { 'display': 'none' };
    this.toastr.success('Approval criteria saved successfully.', 'Success!');
    this.dialog.close(true);
  });
  }

  public checkRangeAmount(): void {

  this.approvalContext.rangeAmtError =  Number(this.approvalContext.rangeStart.replace(/[^0-9\.]+/g,""))
    > Number(this.approvalContext.rangeEnd.replace(/[^0-9\.]+/g,"")) 
    ? true : false;

}

  public closeModel(): void {
  this.dialog.close(false);
}

}
