import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { SyncModelComponent, SyncModalContext } from './sync-modal.component';


@Component({
    selector: 'sp-waiting-invoice-attribute',
    templateUrl: './waiting-invoices.component.html'
})

export class WaitingInvoiceComponent extends BaseComponent implements OnInit {

    @Input() syncBatcheInvoices: Array<SyncBatchEntryModel>;
    @Input() totalItems: number;
    @Output() public invoceRemoved: EventEmitter<any> = new EventEmitter<any>();
    private syncBatch: SyncBatchModel;
    constructor(
        vcRef: ViewContainerRef,
        overlay: Overlay,
        public modal: Modal,
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

    public openRejectionPopup(invoiceId, companyId, invAmount, rejectionComment) {
        const builder = new BSModalContextBuilder<SyncModalContext>(
            { invoiceId: invoiceId, companyId: companyId, invAmount: invAmount, rejectionComment: rejectionComment } as any,
            undefined,
            SyncModalContext
        );

        let overlayConfig: OverlayConfig = {
            context: builder.toJSON()
        };
        // return this.modal.open(InvoiceEntryAccountsComponent, overlayConfig)
        //   .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
        //    .then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
        //    .then(result => {
        //     alert(result)
        //    this.addGlAccountByPopup(result);

        //    })

        return this.modal.open(SyncModelComponent, overlayConfig)
            .catch(err => err) // catch error not related to the result (modal open...)
            .then(dialog => dialog.result) // dialog has more properties,lets just return the promise for a result.
            .then(result => {
                if (result === true) {
                this.invoceRemoved.emit();
            }
                // this.addGlAccountByPopup(result);

            });

    }
    // releaseInvoice(): void {
    //     this.syncBatch.SyncBatcheInvoices = this.syncBatcheInvoices;
    //     {
    //         let message = 'Are you sure you' + 'd like to synced these filtered';
    //         if (this.confirmService.confermMessage(message, 'Invoices?')) {
    //                 this.syncBatchEntryService.releaseInvoiceforSyncing(this.syncBatch).then( (result) => {
    //            // messageService.showMsgBox('Success', 'Invoices releases successfully', 'success');
    //            // $location.path('/syncbatches');
    //         });

    //         }

    //     }
    // if (confirm('Are you sure you'd like to synced these filtered Invoices?') === true) {
    //     this.syncBatchEntryService.releaseInvoiceforSyncing(syncBatch).then(function (result) {
    //         messageService.showMsgBox('Success', 'Invoices releases successfully', 'success');
    //        // $location.path('/syncbatches');
    //     });
    // }
    // }

}
