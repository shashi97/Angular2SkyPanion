import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';

import { InvoiceModel,InvApprovals } from '../shared/invoice.model';
import { InvoiceService } from '../shared/invoice.service';
import { InvoiceArgs } from './invoice-detail.component';


@Component({
  selector: 'sp-invoice-detail-invoice',
  templateUrl: './invoice.component.html',
})

export class InvoiceDetailInvoiceComponent extends BaseComponent implements OnInit {

  @Input() invoiceDetail: InvoiceModel;
  @Input() invoiceArgs: InvoiceArgs;
  private invType;
  private invoiceID;
  private invApprovals: Array<InvApprovals>;


  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {
    super(localStorageService, router);
    this.invApprovals = new  Array<InvApprovals>();
  }

  ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        //this.attachmentId = +params['attachmentId']; // (+) converts string 'id' to a number
        this.invoiceID = +params['InvoiceID']
        //this.getInvoiceApprovals();
      });
  }

  private getInvoicePdf(): void {
    this.invoiceArgs.invType = 'pdf';
  }
   private getInvoiceApprovalsAllow  (invoiceID, InvoiceAmount, CompanyID):void {
            this.invType = 'approvals';
            this.getInvoiceApprovals(invoiceID, InvoiceAmount, CompanyID);
        }

  private getInvoiceApprovals(invoiceID, InvoiceAmount, CompanyID): void {
    this.invoiceArgs.invType = 'approvals';
    this.invoiceService.getInvoiceApprovals (
      invoiceID, InvoiceAmount, CompanyID)
      .then(result => {
        if (result.status === 404) {
        } else if (result.status === 500) {
        } else {
          this.invApprovals = result;
        }
      });
  }
}
