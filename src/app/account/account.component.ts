import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BaseComponent } from '../base.component';
import { AccountService } from './shared/account.service';

@Component({
  selector: 'sp-account',
  templateUrl: './account.component.html',
})

export class AccountComponent extends BaseComponent implements OnInit {
  accountId: number = 0;
  account: Object;

  constructor(
    public localStorageService: LocalStorageService,
    public router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    if (this.user) {
      this.getParameterValue();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValue(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['id'];
      this.getAccount();
    });
  }

  getAccount() {
 return new Promise((resolve, reject) => {
    this.accountService.getAccount(this.accountId).then(result => {
      if (result.status === 404) {
         this.toastr.error('There is no data avability', 'Oops!');
      } else if (result.status === 500) {
      } else {
        this.account = result;
      }
    });
  });
  }
}
