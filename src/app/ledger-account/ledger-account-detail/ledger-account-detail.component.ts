import { Component, OnInit , AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { LedgerAccountModel } from '../shared/ledger-account.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { UserService } from '../../user/shared/user.service';
import { LedgerAccountService } from '../shared/ledger-account.service';

import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'sp-ledger-account-detail',
  templateUrl: './ledger-account-detail.component.html',
})

export class LedgerAccountDetailComponent extends BaseComponent implements OnInit , AfterViewInit {
  private showLoader:boolean;
  private id: number = 0;
  private companyId: number = 0;
  private currentPage: number = 1;
  private pageSize: number = 25;
  private ledgerAccountDetail: LedgerAccountModel;
  private ledgerAccounts: Array<LedgerAccountModel>;
  private totalItems: number = 0;
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private ledgerAccountService: LedgerAccountService,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.ledgerAccountDetail = new LedgerAccountModel();
  }

  ngOnInit(): void {
      this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
  }

   ngAfterViewInit(){
      if (this.user) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getledgerAccountsDetail();
    });
  }

  private getledgerAccountsDetail() {
    return new Promise((resolve, reject) => {
    this.ledgerAccountService.getledgerAccountsDetail(this.id, this.companyId).then(result => {
      if (result.status === 404) {
        this.ledgerAccountDetail = new LedgerAccountModel();
      } else {
        this.ledgerAccountDetail = result;
        this.getledgerAccountDistribution(this.id);
      }
     });
    });
  }

  private getledgerAccountDistribution(id: number): void {
    this.ledgerAccountService.getledgerAccountDistribution(id, this.currentPage, this.pageSize).then((result) => {
      if (result.status === 404) {
        this.ledgerAccounts = new Array<LedgerAccountModel>();
      } else {
        this.ledgerAccounts = result;
        this.totalItems = this.ledgerAccounts[0].TotalCount;
      }
    });
  }
}
