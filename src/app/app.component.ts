import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserService } from './user/shared/user.service';
import { AuthService } from './shared/services/otherServices/auth.service';

@Component({
  selector: 'sp-app',
  templateUrl: './app.component.html',

})

export class AppComponent extends BaseComponent implements OnInit {

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,

    private authService: AuthService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    let link = [];
    if (this.user) {
      link = ['/company/-1/-1'];
    } else {
      this.disableSideBar = { 'display': 'none' };
      link = ['/login'];
    }
    this.router.navigate(link);
  }

  private logOut() {
    if (confirm('Are you sure you would like to log out of SkyPanion?') === true) {
      this.localStorageService.remove('authorization');
      this.localStorageService.remove('sessionData');
      this.disableMenu = { 'display': 'none' };
      this.disableSideBar = { 'display': 'none' };
      let link = ['/login'];
      this.router.navigate(link);
    }
  }
}
