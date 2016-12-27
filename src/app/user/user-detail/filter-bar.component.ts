import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { UserModel } from '../shared/user.model';
import { PagingFilterArgumentsModel } from '../../shared/models/pagination-filter.model';

@Component({
  selector: 'sp-user-detail-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class UserDetailFilterComponent extends BaseComponent implements OnInit {

  @Input() userDetail: UserModel;
   private paginationFilter: PagingFilterArgumentsModel;
  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
    this.paginationFilter = new PagingFilterArgumentsModel();
  }

  ngOnInit() {

  }
}
