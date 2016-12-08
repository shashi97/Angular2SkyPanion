import { Component, Output, EventEmitter } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ApprovalCriteriaModel } from '../shared/approval-criteria.model';


export class ApprovalContext extends BSModalContext {
    data: any;
    type: any;
    isNew: any;
    approvals: Array<ApprovalCriteriaModel>= [];
}

@Component({
    selector: 'modal',
    // styleUrls: ['./bootstrap.min.css'],
    // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
    // Remove when solved.
    /* tslint:disable */
    templateUrl: './approval-criteria.modal.html',
})

export class ApprovalModalComponent implements CloseGuard, ModalComponent<ApprovalContext> {
     context: ApprovalContext;
    constructor(public dialog: DialogRef<ApprovalContext>,
        public toastr: ToastsManager) {
         this.context = dialog.context;
         //this.showApprovalCriteria( this.context.data,);
    
    }
    //  public showApprovalCriteria(data, type, isNew): void  {
    //         if ($scope.companyID == 0) {
    //             ledgerAccountsService.getLedgerAccountDDOsAccountTypeWise(data.CompanyID).then(function (result) {
    //                 $scope.ledgerAccounts = result.data;
    //                 $scope.selectedLedgerAccount = [];
    //                 $scope.selectedLedgerAccount.selected = [];
    //                 $scope.showApprovalCriteria2(data, type, isNew);
    //             });
    //         }
    //         else {
    //             $scope.showApprovalCriteria2(data, type, isNew);
    //         }
    //     }

    //     $scope.showApprovalCriteria2 = function (result, type, isNew) {
    //         $scope.rangeAmtError = false;
    //         if (isNew == 1) {
    //             if ($scope.ApproversCount > 0) {
    //                 $scope.AddEditApproverCriteria(result, type)
    //             }
    //             else {
    //                 $scope.divAddApprover = false;
    //                 messageService.showMsgBox("Approval Criteria", 'There are no user accounts with the permission required to approve invoices.Please go to the settings page to configure permissions', "error");
    //                 //alert('There are no user accounts with the permission required to approve invoices.Please go to the settings page to configure permissions');
    //                 return;
    //             }
    //         }
    //         else {
    //             $scope.divAddApprover = true;
    //             $scope.AddEditApproverCriteria(result, type);
    //         }
    //     }

    public closeModel(): void {
        this.dialog.close();
    }
  


}
