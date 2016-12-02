import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { InvoiceModel } from '../shared/invoice.model';
import { InvoiceService } from '../shared/invoice.service';
import { InvoiceArgs } from './invoice-detail.component';


@Component({
  selector: 'sp-invoice-detail-invoice',
  templateUrl: './invoice.component.html',
})

export class InvoiceDetailInvoiceComponent extends BaseComponent implements OnInit {

  @Input() invoiceDetail: InvoiceModel;
  @Input() invoiceArgs: InvoiceArgs;

  private invApprovals: Array<any> = [];


  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private invoiceService: InvoiceService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private getInvoicePdf(): void {
    this.invoiceArgs.invType = 'pdf';
  }

  private getInvoiceApprovals(): void {
    this.invoiceArgs.invType = 'approvals';
    this.invoiceService.getInvoiceApprovals(
      this.invoiceArgs.invoiceId,
      this.invoiceDetail.InvoiceAmount,
      this.invoiceDetail.CompanyID)
      .then(result => {
        if (result.status === 404) {
        } else if (result.status === 500) {
        } else {
          this.invApprovals = result;
        }
      });
  }
}