import { Component, OnInit, ViewChild  } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { SyncTypeArgument } from '../../shared/dropdown/sync-type/sync-type.component';
import { CompanyPathArgument } from '../../shared/dropdown/company-path/company-path.component';
@Component({
  selector: 'sp-company-filter-bar',
  templateUrl: './filter-bar.component.html',
})
export class CompanyFilterComponent extends BaseComponent implements OnInit {

  // @Input() vendorDetail: VendorModel;
  // @Output() filtered: EventEmitter<VendorFilterArguments> = new EventEmitter<VendorFilterArguments>();
  // @Input() filteredValue: VendorFilterArguments = new VendorFilterArguments();
  private searchText: any = null;
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
    // console.log(this.vendorDetail);

  }

  ngOnInit() {}

  private searchURL(): void {
    // if (this.searchText === '' || this.searchText === undefined || this.searchText === 'null') {
    //  // this.searchText = null;
    // }
    let link = ['/company/' + this.searchText +
      ',' + this.syncTypeFiltered.syncID +
      ',' + this.companyPathFiltered.syncTypeID];
    this.router.navigate(link);

  }

  private searchURLReset(): void {
    this.syncTypeFiltered.syncID = '-1';
    this.companyPathFiltered.syncTypeID = '-1';
    this.searchText = '';
    this.syncTypeFiltered.syncName = 'Sync Type';
    this.companyPathFiltered.companyType = 'Company Type';
    this.searchURL();
  };
}
