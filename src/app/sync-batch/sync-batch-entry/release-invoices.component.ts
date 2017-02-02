import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
    confirmationModalContext,
    confirmationModalComponent
} from '../../shared/confirmation-modal/confirmation-modal.component';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
@Component({
    selector: 'sp-release-invoice-attribute',
    templateUrl: './release-invoices.component.html'
})

export class ReleaseInvoiceComponent extends BaseComponent implements OnInit {
    private header: string = "";
    @Input() syncBatcheInvoices: Array<SyncBatchEntryModel>;
    private syncBatch: SyncBatchModel;
    constructor(
        localStorageService: LocalStorageService,
        router: Router,
        overlay: Overlay, public modal: Modal,
        public confirmService: ConfirmService,
        public vcRef: ViewContainerRef,
        private syncBatchEntryService: SyncBatchService,
        public toastr: ToastsManager
    ) {
        super(localStorageService, router);
        this.syncBatch = new SyncBatchModel();
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit() {
    }

    ChangeStateConfirmationModal() {
        this.header = "Are you sure you'd like to synced these filtered";
        const builder = new BSModalContextBuilder<confirmationModalContext>(
            { header: this.header } as any,
            undefined,
            confirmationModalContext
        );

        let overlayConfig: OverlayConfig = {
            context: builder.isBlocking(false).toJSON()
        };

        const dialog = this.modal.open(confirmationModalComponent, overlayConfig);
        dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
                // alert(result.status);
                if (result === "true") {
                    this.releaseInvoice();
                }
            }, () => console.log(' user canceled logout modal '));
        });


    }

    releaseInvoice(): void {
        this.syncBatch.SyncBatcheInvoices = this.syncBatcheInvoices;
        {
            this.syncBatchEntryService.releaseInvoiceforSyncing(this.syncBatch).then((result) => {
                this.toastr.success('Invoices releases successfully', 'Success!');
                let link = ['/syncBatch/-1/-1'];
                this.router.navigate(link);
            });


        }
    }

}
