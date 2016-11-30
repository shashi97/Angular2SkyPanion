import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';
import { CompanyDropdownComponent } from '../../shared/dropdown/company/company-dropdown.component';

@Component({
  selector: 'sp-sync-batch-entry',
  templateUrl: './sync-batch-entry.component.html',
})

export class SyncBatchEntryComponent extends BaseComponent implements OnInit {

  constructor(

    localStorageService: LocalStorageService,
    router: Router

  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }


}



