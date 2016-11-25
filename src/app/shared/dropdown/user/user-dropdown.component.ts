import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserService } from '../../../user/shared/user.service';


@Component({
  selector: 'sp-user-dropdown',
  templateUrl: './user-dropdown.component.html',
})

export class UserDropdownComponent extends BaseComponent implements OnInit {
  private users: Array<any> = [];
  private userName: string = 'Select Clerk';
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService
  ) {
    super(localStorageService, router);
    this.getSkypanionsUsers();
  }

  ngOnInit() {
  }

  private getSkypanionsUsers() {
    this.userService.getUserDDOs().then(result => {
      this.users = result.data;
    });
  }

}