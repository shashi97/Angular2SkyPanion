import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
        private syncBatchEntryService: SyncBatchService,
        public toastr: ToastsManager
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
                this.syncBatchEntryService.releaseInvoiceforSyncing(this.syncBatch).then((result) => {
                    this.toastr.success('Invoices releases successfully', 'Success!');
                    let link = ['syncBatcheNew/-1/-1'];
                    this.router.navigate(link);
                });

            }

        }
    }

}
