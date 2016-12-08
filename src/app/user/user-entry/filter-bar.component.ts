import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserModel } from '../shared/user.model';

@Component({
  selector: 'sp-user-entry-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class UserEntryFilterComponent extends BaseComponent implements OnInit {

  @Input() userDetail: UserModel;
  @Input() messageHeader: string = '';
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}
