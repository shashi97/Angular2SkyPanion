import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

export class VendorFilterArguments {
  companyId: number
}

@Component({
  selector: 'sp-crumb-bar',
  templateUrl: './crumb-bar.component.html',
})

export class CrumbBarComponent extends BaseComponent implements OnInit {
  @Input() pageDetail: any;
  private pageName: string = '';
  private pageUrl: string = '';
  private pageId: number = 0;

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    if (this.pageDetail.AccountName) {
      this.pageUrl = 'account';
      this.pageName = this.pageDetail.AccountName;
      this.pageId = this.pageDetail.AccountID;
    } else if (this.pageDetail.VendorName) {
      this.pageUrl = 'vendor';
      this.pageName = this.pageDetail.VendorName;
    } else if (this.pageDetail.PortalAccName) {
      this.pageUrl = 'achSetups';
      this.pageName = this.pageDetail.PortalAccName;
    } else if (this.pageDetail.InvoiceNumber) {
      this.pageUrl = 'invoices';
      this.pageName = 'invoices';
    }

  }

}
