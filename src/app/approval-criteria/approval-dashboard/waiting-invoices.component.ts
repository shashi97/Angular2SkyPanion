import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
//import { SyncBatchModel, SyncBatchEntryModel } from '../shared/sync-batch-entry.model';
//import { SyncBatchService } from '../shared/sync-batch.service';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
//import { SyncModelComponent, SyncModalContext } from './sync-modal.component';

@Component({
    selector: 'sp-waiting-invoice-attribute',
    templateUrl: './waiting-invoices.component.html'
})

export class WaitingInvoiceComponent extends BaseComponent implements OnInit {

    @Input() syncBatcheInvoices: Array<SyncBatchEntryModel>;
    @Input() totalItems: number;
    @Output() invoceRemoved: EventEmitter<any> = new EventEmitter<any>();
    //private syncBatch: SyncBatchModel;
    constructor(
        vcRef: ViewContainerRef,
        overlay: Overlay,
        public modal: Modal,
        localStorageService: LocalStorageService,
        router: Router,
        public confirmService: ConfirmService
       // private syncBatchEntryService: SyncBatchService
    ) {
        super(localStorageService, router);
        //this.syncBatch = new SyncBatchModel();
        // overlay.defaultViewContainer = vcRef;
    }
     ngOnInit() {
    }
     private openRejectionPopup(invoiceId, invAmount, companyId, rejectionComment) {

     }



}