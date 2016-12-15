import { Component, Output, EventEmitter } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { SyncBatchService } from '../shared/sync-batch.service';


export class SyncModalContext extends BSModalContext {
    invoiceId: number;
    companyId: string;
    invAmount: number;
    InvoiceNumber: string;
}

export class ShowDashboardDetail {
    showMessage: boolean = false;
    dashboardMessage: string = '';
    status: boolean = false;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
    selector: 'sync-modal',
    templateUrl: './sync-modal.component.html',
})

export class SyncModelComponent implements CloseGuard, ModalComponent<SyncModalContext> {
    //  context: CustomModalContext;
    private syncModel: SyncModalContext;
    private showDashboardDetail: ShowDashboardDetail;
    private rejectionComment: string;
    private errorsInv: Array<any> = [];
    private errorHeader: string;
    private showdashboardMessage: boolean = false;
    private dashboardMessage: string;
    constructor(public dialog: DialogRef<SyncModalContext>,
        private syncBatchService: SyncBatchService
    ) {
        this.syncModel = dialog.context;
        this.showDashboardDetail = new ShowDashboardDetail();
        // this.getDirectoryDetail(this.context.Serverfiles);

        dialog.setCloseGuard(this);
    }
    private closeModal(): void {
        this.dialog.close(this.showDashboardDetail);
    }

    private rejectInvoice(): boolean {
        if (this.rejectionComment == null || this.rejectionComment === '') {
            let obj = { ErrorName: 'Rejection Memo Required to Invoice' };
            this.errorsInv.splice(this.errorsInv.length, 0, obj);
        }

        if (this.errorsInv.length > 0) {
            this.errorHeader = this.errorsInv.length + 'error prevented this invoice from being rejected:';
            return false;
        }

        this.syncBatchService.rejectInvoice(
            this.syncModel.invoiceId,
            this.syncModel.companyId,
            this.syncModel.invAmount,
            this.rejectionComment).then((result) => {
                if (result.Status === 500) {
                } else {
                    this.rejectionComment = null;
                    this.dashboardMessage = 'Invoice Number ' + this.syncModel.InvoiceNumber + 'rejected Successfully';
                    this.showdashboardMessage = true;
                    this.showDashboardDetail.dashboardMessage = this.dashboardMessage;
                    this.showDashboardDetail.showMessage = true;
                    this.showDashboardDetail.status = true;
                    this.dialog.close(this.showDashboardDetail);
                }
            });
    }

}
