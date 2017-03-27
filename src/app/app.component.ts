import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseComponent } from './base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserService } from './user/shared/user.service';
import { AuthService } from './shared/services/otherServices/auth.service';
import { Cookie } from 'ng2-cookies';
import { Modal, BSModalContextBuilder } from 'angular2-modal/plugins/bootstrap';
import { Overlay, OverlayConfig } from 'angular2-modal';
import {
  logoutModalContext,
  logoutComponent
} from './shared/logout-modal/logout-modal.component';

@Component({
  selector: 'sp-app',
  templateUrl: './app.component.html',

})

export class AppComponent extends BaseComponent implements OnInit {

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    overlay: Overlay, vcRef: ViewContainerRef,
    public modal: Modal,
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
  openlogoutModal() {
    const builder = new BSModalContextBuilder<logoutModalContext>(
      { num1: 2, num2: 3 } as any,
      undefined,
      logoutModalContext
    );

    let overlayConfig: OverlayConfig = {
      context: builder.isBlocking(false).toJSON()
    };

    const dialog = this.modal.open(logoutComponent, overlayConfig);
    dialog.then((resultPromise) => {
      return resultPromise.result.then((result) => {
        // alert(result.status);
        if (result === "logout") {
          this.logOut();
        }
      }, () => console.log(' user canceled logout modal '));
    });


  }

  private logOut() {
    this.localStorageService.remove('authorization');
    this.localStorageService.remove('sessionData');
    this.disableMenu = { 'display': 'none' };
    this.disableSideBar = { 'display': 'none' };
    Cookie.delete('Authorization');
    let link = ['/login'];
    this.router.navigate(link);
  }
}
