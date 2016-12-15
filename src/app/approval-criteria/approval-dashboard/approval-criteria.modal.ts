import { Component, Output, EventEmitter } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';
import { LedgerAccountService } from '../../ledger-account/shared/ledger-account.service';
import { ApprovalCriteriaService } from '../shared/approval-criteria.service';
import { LedgerAccountModel } from '../../ledger-account/shared/ledger-account.model';


export class ApprovalContext extends BSModalContext {
    data: ApprovalCriteriaModel;
    type: string;
    isNew: number;
    companyId: number;
    approvers: Array<any>;
    approversCount: number;
    cmpName: string;
}

@Component({
    selector: 'sp-approval-modal',
    // styleUrls: ['./bootstrap.min.css'],
    // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
    // Remove when solved.
    /* tslint:disable */
    templateUrl: './approval-criteria.modal.html'
})

export class ApprovalModalComponent implements CloseGuard, ModalComponent<ApprovalContext> {
    private context: ApprovalContext;
    private modelHeader: string;
    private companyName: string;
    private userName: string;
    private ledgerAccountID: number;
    private type: string;
    private rangeStart: string;
    private rangeEnd: string;
    private divAddApprover: boolean = false;
    private rangeAmtError: boolean = false;
    private errors: Array<any> = [];
    private errorHeader: string;
    private approvalCriteriaID: number;
    private userID: number;
    private ledgerAccounts: Array<any> = [];
    private approvers: Array<any> = [];
    private selectedLedgerAccount: LedgerAccountModel;
    private selectedApprover: ApprovalCriteriaModel;
    private showHideErrorLog: Object = { 'display': 'none' };
    constructor(public dialog: DialogRef<ApprovalContext>,
        public ledgerAccountService: LedgerAccountService,
        public approvalCriteriaService: ApprovalCriteriaService,
        public toastr: ToastsManager) {
        this.context = dialog.context;
        let temp = this.context.approvers;
        this.context.approvers = [];
        temp.map((item: any) => {
            this.context.approvers.push(
                { label: item.username, value: item });
        });
        this.showApprovalCriteria(this.context.data, this.context.type, this.context.isNew);

    }

    public showApprovalCriteria(data, type, isNew): void {
        if (this.context.companyId == 0) {
            this.ledgerAccountService.getLedgerAccountDDOsAccountTypeWise(data.CompanyID).then((result) => {
                this.ledgerAccounts = result;
                let temp = this.ledgerAccounts;
                this.ledgerAccounts = [];
                temp.map((item: any) => {
                    this.ledgerAccounts.push(
                        { label: item.LedgerAccount, value: item });
                });
                // this.selectedLedgerAccount = [];
                // this.selectedLedgerAccount.selected = [];
                this.showApprovalCriteriaReport(data, type, isNew);
            });
        }
        else {
            this.showApprovalCriteriaReport(data, type, isNew);
        }
    }

    private showApprovalCriteriaReport(result, type, isNew): void {
        this.rangeAmtError = false;
        if (isNew == 1) {
            if (this.context.approversCount > 0) {
                this.AddEditApproverCriteria(result, type)
            }
            else {
                this.divAddApprover = false;
                this.toastr.error('There are no user accounts with the permission required to approve invoices.Please go to the settings page to configure permissions', 'Oops!');
                return;
            }
        }
        else {
            this.divAddApprover = true;
            this.AddEditApproverCriteria(result, type);
        }
    }

    private AddEditApproverCriteria(result, type): void {
        this.divAddApprover = true;
        //this.errors = [];
        this.errorHeader = '';

        this.type = type;
        this.approvalCriteriaID = 0;

        // this.selectedApprover.selected = [];
        // this.selectedLedgerAccount.selected = [];
        this.rangeStart = "0";
        this.rangeEnd = "0";

        if (result == null && this.type == 'range') {
            this.modelHeader = 'Create Range Approval';
            this.companyName = this.context.cmpName;
        }
        else if (result == null && this.type == 'ledger') {
            this.modelHeader = 'Create Ledger Account Approval';
            this.companyName = this.context.cmpName;
        }
        else {
            this.modelHeader = 'Edit Range Approval';
            this.approvalCriteriaID = result.ApprovalCriteriaID;
            this.companyName = result.CompanyName;

            this.userID = result.UserID;
            this.userName = result.UserName;

            this.rangeStart = result.RangeStart_cents;
            this.rangeEnd = result.RangeEnd_cents;

            this.ledgerAccountID = result.LedgerAccountID;

            if (this.context.companyId != 0) {
                this.context.approvers.forEach((item) => {
                    if (item.value.UserID == this.userID) {
                        this.selectedApprover = item.value;
                        // this.selectedApprover.selected = item;
                    }
                });

                if (this.type == 'ledger' || this.ledgerAccountID != null) {
                    this.ledgerAccounts.forEach((item) => {
                        if (item.value.LedgerAccountID == this.ledgerAccountID) {
                            this.selectedLedgerAccount = item.value;
                            //  this.selectedLedgerAccount.selected = item;
                        }
                    });
                }
            } else {
                if (this.ledgerAccountID != null) {
                    this.ledgerAccounts.forEach((item) => {
                        if (item.value.LedgerAccountID == this.ledgerAccountID) {
                            this.selectedLedgerAccount = item.value;
                            // this.selectedLedgerAccount.selected = item;
                        }
                    });
                }
            }
        }
    }

    private saveApprovalCriteria(): void {
        this.errors = [];
        this.errorHeader = '';
        this.userID = 0;
        var ledgerAccountID = 0;
        if (this.context.companyId != 0) {
            if (this.selectedApprover == undefined) {
                //var obj = { ErrorName: "Please select Approver" }
                //this.errors.splice(this.errors.length, 0, obj);
            }
            else {
                this.userID = this.selectedApprover.UserID;
            }
        }

        if (this.type == 'ledger' || this.ledgerAccountID != null) {
            if (this.selectedLedgerAccount === undefined) {
                var obj = { ErrorName: "Please select Ledger Account" }
                this.errors.splice(this.errors.length, 0, obj);
            }
            else {
                ledgerAccountID = this.selectedLedgerAccount.LedgerAccountID;
            }
        }


        if ((this.type == '' || this.type == 'range') && this.ledgerAccountID == null) {

            if (this.rangeStart == "" || this.rangeStart == null) {
                var obj = { ErrorName: "Please enter Range Start" }
                this.errors.splice(this.errors.length, 0, obj);
            }

            if (this.rangeEnd == "" || this.rangeEnd == null) {
                var obj = { ErrorName: "Please enter Range End" }
                this.errors.splice(this.errors.length, 0, obj);
            }

            if (parseFloat(this.rangeStart) > parseFloat(this.rangeEnd)) {
                var obj = { ErrorName: "Range Start cannot exceed Range End" }
                this.errors.splice(this.errors.length, 0, obj);
            }
        }

        if (this.context.companyId != 0 && this.userID == 0) {
            var obj = { ErrorName: "Please select Approver" }
            this.errors.splice(this.errors.length, 0, obj);
        }
        if (this.ledgerAccountID == 0 && (this.type == 'ledger' || this.type == '') && this.ledgerAccountID != null) {
            var obj = { ErrorName: "Please select Ledger Account" }
            this.errors.splice(this.errors.length, 0, obj);
        }
        if (this.errors.length > 0) {
            this.showHideErrorLog = { 'display': 'block' };
            this.errorHeader = this.errors.length + ' errors prohibited this range approval from being saved:';
            return;
        }
        if (this.type == '') {
            this.type = null;
        }

        this.approvalCriteriaService.saveApprovalCriteria(
            this.approvalCriteriaID,
            this.context.companyId,
            this.rangeStart,
            this.rangeEnd,
            this.userID,
            ledgerAccountID,
            this.type)
            .then((result) => {
                if (this.type == null) {
                    this.type = 'all';
                }
                this.showHideErrorLog = { 'display': 'none' };
                // alert("Approval criteria saved successfully.");
                this.toastr.success('Approval criteria saved successfully.', 'Success!');
                // messageService.showMsgBox("Approval Criteria", "Approval criteria saved successfully.", "success");

                //   this.type = 'all';
                this.dialog.close(this.type);
                //  this.getApprovalCriteria(this.type);
                //  $('.close_button').trigger('click');
            });
    }

    private checkRangeAmount(): void {

        if (parseFloat(this.rangeStart) > parseFloat(this.rangeEnd)) {
            this.rangeAmtError = true;
        } else {
            this.rangeAmtError = false;
        }
    }

    public closeModel(): void {
        this.dialog.close();
    }

}
