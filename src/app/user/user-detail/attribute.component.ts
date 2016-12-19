import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { UserModel } from '../shared/user.model';
import { UserService } from '../../user/shared/user.service';

@Component({
  selector: 'sp-user-detail-attribute',
  templateUrl: './attribute.component.html',
})

export class UserDetailAttributeComponent extends BaseComponent implements OnInit {

  @Input() userDetail: UserModel;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}
