import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
@Component({
    selector: 'sp-release-invoice-attribute',
    templateUrl: './release-invoices.component.html'
})

export class ReleaseInvoiceComponent extends BaseComponent implements OnInit {

    @Input() syncBatcheInvoices: Array<SyncBatchEntryModel>;
    private syncBatch: SyncBatchModel;
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        public confirmService: ConfirmService,
        private syncBatchEntryService: SyncBatchService
    ) {
        super(localStorageService, router);
        this.syncBatch = new SyncBatchModel();
    }

    ngOnInit() {
    }

    releaseInvoice(): void {
        this.syncBatch.SyncBatcheInvoices = this.syncBatcheInvoices;
        {
            let message = 'Are you sure you' + 'd like to synced these filtered';
            if (this.confirmService.confermMessage(message, 'Invoices?')) {
                    this.syncBatchEntryService.releaseInvoiceforSyncing(this.syncBatch).then( (result) => {
               // messageService.showMsgBox('Success', 'Invoices releases successfully', 'success');
               // $location.path('/syncbatches');
            });

            }

        }
        // if (confirm('Are you sure you'd like to synced these filtered Invoices?') === true) {
        //     this.syncBatchEntryService.releaseInvoiceforSyncing(syncBatch).then(function (result) {
        //         messageService.showMsgBox('Success', 'Invoices releases successfully', 'success');
        //        // $location.path('/syncbatches');
        //     });
        // }
    }

}
