import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

export class VendorFilterArguments {
  companyId: number
}

export class BreadCrumb {
  constructor(public path: string,
    public title: string) {
  }
}

export class BreadCrumbs {
  values: Array<BreadCrumb> = new Array<BreadCrumb>();
  constructor() {

    this.values.push(new BreadCrumb('account', 'Accounts'));
    this.values.push(new BreadCrumb('vendors', 'Vendors'));
  }
  find(path) {
    return this.values.filter(i => { return i.path === path; })[0];
  }
}

export class CrumbModel {
  entityId: string;
  state: string;
}

export class UrlModel {
  linkTitle: string;
  urlFragement: string;
}

@Component({
  selector: 'sp-crumb-bar',
  templateUrl: './crumb-bar.component.html',
})

export class CrumbBarComponent extends BaseComponent implements OnInit {
  @Input() model: CrumbModel;
  @Input() pageDetail: any;

  private firstUrlPart: UrlModel = new UrlModel();
  private secondUrlPart: UrlModel = new UrlModel();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    const breadCrumbs: BreadCrumbs = new BreadCrumbs();

    this.activatedRoute.url.subscribe(segments => {
      const firstBreadCrumb = breadCrumbs.find(segments[0].path);
      this.firstUrlPart.urlFragement = segments[0].path;
      this.firstUrlPart.linkTitle = firstBreadCrumb.title;
      let isEdit = false;
      if (segments.length > 1) {
        if (segments[1].path === 'edit' || segments[1].path === 'detail') {
          isEdit = true;
        };
      }
      if (segments.length > 2) {
        let firstUrl = '';
        if (isEdit) {
          firstUrl = segments[0].path + '/' + segments[2].path;
        } else {
          firstUrl = segments[0].path + '/' + segments[1].path + '/' + segments[2].path;
        }
        if (segments.length > 3) {
          firstUrl += '/' + segments[3].path;
        }
        this.firstUrlPart.urlFragement = firstUrl;
      }
    });


    // if (this.pageDetail.AccountName) {
    //   this.pageUrl = 'account';
    //   this.pageName = this.pageDetail.AccountName;
    //   this.pageId = this.pageDetail.AccountID;
    // } else if (this.pageDetail.VendorName) {
    //   this.pageUrl = 'vendor';
    //   this.pageName = this.pageDetail.VendorName;
    // } else if (this.pageDetail.PortalAccName) {
    //   this.pageUrl = 'achSetups';
    //   this.pageName = this.pageDetail.PortalAccName;
    // } else if (this.pageDetail.InvoiceNumber) {
    //   this.pageUrl = 'invoices';
    //   this.pageName = 'invoices';
    // }
  }
}

