import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompanyDropdownComponent, CompanyFilterArguments } from '../../shared/dropdown/company/company-dropdown.component';

import { LedgerAccountModel } from '../shared/ledger-account.model';

export class LedgerFilterArguments {
  accountNumberSearch: string = '';
  accountTitleSearch: string = '';
}

@Component({
  selector: 'sp-ledger-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class LedgerAccountFilterComponent extends BaseComponent implements OnInit {

  @Output() filtered: EventEmitter<LedgerFilterArguments> = new EventEmitter<LedgerFilterArguments>();
  @Input() filteredValue: LedgerFilterArguments = new LedgerFilterArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  private searchUrl(): void {
    this.filtered.emit(this.filteredValue);
  }

  private searchUrlReset(): void {
    this.filteredValue = new LedgerFilterArguments();
    this.filtered.emit(this.filteredValue);
  }
}
