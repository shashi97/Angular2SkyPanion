import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'sp-waiting-invoice-attribute',
  templateUrl: './waiting-invoices.component.html'
})

export class WaitingInvoiceComponent extends BaseComponent implements OnInit {

  @Input() syncBatcheInvoices: Array<SyncBatchEntryModel>;
  @Input() totalItems: number;
  @Output() invoceRemoved: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    vcRef: ViewContainerRef,
    overlay: Overlay,
    public modal: Modal,
    localStorageService: LocalStorageService,
    router: Router,
    public confirmService: ConfirmService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private openRejectionPopup(invoiceId, invAmount, companyId, rejectionComment) {
  }
}
