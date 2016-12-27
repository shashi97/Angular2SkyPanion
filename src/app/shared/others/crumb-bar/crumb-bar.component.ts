import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../account/shared/account.service';

export class VendorFilterArguments {
  companyId: number
}

export class TitleModel {
  pageName: string;
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
    this.values.push(new BreadCrumb('vendor', 'Vendors'));
    this.values.push(new BreadCrumb('company', 'Companies'));
    this.values.push(new BreadCrumb('job', 'Jobs'));
    this.values.push(new BreadCrumb('invoice', 'Invoices'));
    this.values.push(new BreadCrumb('purchaseOrder', 'Purchase Order'));
    this.values.push(new BreadCrumb('ledgerAccount', 'Ledger Accounts'));
    this.values.push(new BreadCrumb('achSetup', 'Ach Setups'));
    this.values.push(new BreadCrumb('approval', 'Approval'));
    this.values.push(new BreadCrumb('syncBatch', 'All Sync Batches'));
    this.values.push(new BreadCrumb('user', 'All Users'));
    this.values.push(new BreadCrumb('role', 'Roles'));
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
  @Input() pageName: TitleModel;

  private firstUrlPart: UrlModel = new UrlModel();

  // @Input()
  // public lastUrlPart: UrlModel = new UrlModel();

  @Input()
  public lastTitle: string = '';


  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    const breadCrumbs: BreadCrumbs = new BreadCrumbs();

    this.activatedRoute.url.subscribe(segments => {
      const firstBreadCrumb = breadCrumbs.find(segments[0].path);
      this.firstUrlPart.urlFragement = '/' + segments[0].path;
      this.firstUrlPart.linkTitle = firstBreadCrumb.title;
      let isEdit = false;
      
      if (segments.length > 1) {
        if (segments[1].path === 'edit' || segments[1].path === 'detail' || segments[1].path === 'entry' || segments[1].path === 'view') {
          isEdit = true;
        } else {
          this.lastTitle = this.firstUrlPart.linkTitle;
          this.accountService.getAccountName().then(result => {
            this.firstUrlPart.linkTitle = result.AccountName;
            this.firstUrlPart.urlFragement = '/account/' + result.AccountID;
          });
        }
      }

      if (isEdit) {
        this.activatedRoute.params.subscribe(param => {

          let url = this.firstUrlPart.urlFragement;
          if (param['pageSizeFilter']) {
            url += '/' + param['pageSizeFilter'];
          }
          if (param['searchParameters']) {
            url += '/' + param['searchParameters'];
          }
          this.firstUrlPart.urlFragement = url;
        });
      };

    });

  }
}

