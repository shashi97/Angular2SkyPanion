import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { SyncTypeArgument } from '../../shared/dropdown/sync-type/sync-type.component';
import { CompanyPathArgument } from '../../shared/dropdown/company-path/company-path.component';

export class CompanyFilterArguments {
  searchText: string = '';
  syncTypeId: string = '-1';
  syncId: string = '-1';
  // companyType: string = 'Company Type';
  // syncName: string = 'Sync Type';
}


@Component({
  selector: 'sp-company-filter-bar',
  templateUrl: './filter-bar.component.html'
})

export class CompanyFilterComponent extends BaseComponent implements OnInit, OnChanges {


  @Output() filtered: EventEmitter<CompanyFilterArguments> = new EventEmitter<CompanyFilterArguments>();
  @Input() filteredValue: CompanyFilterArguments = new CompanyFilterArguments();

  private _syncType: SyncTypeArgument = new SyncTypeArgument();
  private _companyPath: CompanyPathArgument = new CompanyPathArgument();

  private get syncTypeFiltered(): SyncTypeArgument {
    return this._syncType;
  }
  private set syncTypeFiltered(newValue: SyncTypeArgument) {
    this._syncType = newValue;
    // this.getJobs();
  }

  public onsyncTypeChanged(newValue: SyncTypeArgument) {
    this.syncTypeFiltered = newValue;
  }


  private get companyPathFiltered(): CompanyPathArgument {
    return this._companyPath;
  }
  private set companyPathFiltered(newValue: CompanyPathArgument) {
    this._companyPath = newValue;
    // this.getJobs();
  }

  public oncompanyPathChanged(newValue: CompanyPathArgument) {
    this.companyPathFiltered = newValue;
  }


  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() { }
  ngOnChanges(): void {
    this.companyPathFiltered.syncTypeId = this.filteredValue.syncTypeId;
    this.syncTypeFiltered.syncId = this.filteredValue.syncId;

  }


  private searchUrl(): void {
    this.filteredValue.syncId = this.syncTypeFiltered.syncId;
    this.filteredValue.syncTypeId = this._companyPath.syncTypeId;
    this.filtered.emit(this.filteredValue);
  }

  private searchUrlReset(): void {
    this.syncTypeFiltered = new SyncTypeArgument();
    this.companyPathFiltered = new CompanyPathArgument();
    this.filteredValue = new CompanyFilterArguments();
    this.filtered.emit(this.filteredValue);
  };
}
