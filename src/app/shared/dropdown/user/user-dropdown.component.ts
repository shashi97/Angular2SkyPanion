import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserService } from '../../../user/shared/user.service';


export class UserFilterArguments {
  UserID: number = -1;
  userName: string= '';
}

@Component({
  selector: 'sp-user-dropdown',
  templateUrl: './user-dropdown.component.html'
})

export class UserDropdownComponent extends BaseComponent implements OnInit {

  @Output() public userFiltered: EventEmitter<UserFilterArguments> = new EventEmitter<UserFilterArguments>();
  @Input() userFilteredArg: UserFilterArguments = new UserFilterArguments();
  private users: Array<any> = [];
  private selectedUser: any;
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
      this.users = result;
       let obj = { UserID: 0, username: 'None', ImagePathName: 'None' };
       this.users.splice(0, 0, obj);
    });
  }

  private selectUser(selectedUser): void {
    this.userFilteredArg.UserID = selectedUser.UserID;
    this.userFilteredArg.userName = selectedUser.username;
    this.userFiltered.emit(this.userFilteredArg);
  }
}
