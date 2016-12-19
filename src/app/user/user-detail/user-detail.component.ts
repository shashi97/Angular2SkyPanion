import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserModel } from '../shared/user.model';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { UserService } from '../../user/shared/user.service';


@Component({
  selector: 'sp-user-detail',
  templateUrl: './user-detail.component.html',
})

export class UserDetailComponent extends BaseComponent implements OnInit {

  private userId: number = 0;
  private pageSizeFilter: number = 0;
  private searchString: string = '';
  private userDetail: UserModel;


  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location) {
    super(localStorageService, router);
  }

  ngOnInit() {
    this.getParameterValues();
  }


  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.pageSizeFilter = params['pageSizeFilter'];
      this.pageSizeFilter = this.pageSizeFilter === -1 ? 25 : this.pageSizeFilter;
      this.searchString = this.pageSizeFilter + '/' + this.userId;
      this.getUserById();
    });
  }

  private getUserById() {
    this.location.replaceState('user/detail/' + this.searchString);

    this.userService.getUserById(this.userId).then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.userDetail = result;
      }
    });
  }

}
