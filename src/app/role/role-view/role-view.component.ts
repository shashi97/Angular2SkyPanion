import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../account/shared/account.service';
import { RoleService } from '../shared/role.service';
import { RoleModel } from '../shared/role.model';
@Component({
  selector: 'sp-role-view',
  templateUrl: './role-view.component.html'
})

export class RoleViewComponent extends BaseComponent implements OnInit {

  private roleId: number;
  // private pageSizeFilter: number;
  private searchString: string = '';

  public role: RoleModel;
  constructor(
    public localStorageService: LocalStorageService,
    public router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    super(localStorageService, router);
    this.role = new RoleModel();
    this.getSessionDetails();

  }
  ngOnInit(): void { }

  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getParameterValues();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {

      let pageSizeFilter = Number(params['pageSizeFilter'] ? params['pageSizeFilter'] : '-1');
      let searchParameters = Number(params['searchParameters'] ? params['searchParameters'] : '-1');
      this.roleId = Number(params['roleId']);
      this.searchString = pageSizeFilter + '/' + searchParameters + '/' + this.roleId;
      this.getMemberRoleDetail();
    });
  };

  private getMemberRoleDetail(): void {

    this.location.replaceState('roleView/' + this.searchString);

    this.roleService.getMemberRoleDetail(this.roleId).then((result) => {
      if (result.status === 404 || result.status === 500) {
      } else {
        this.role = result;
      }
    });

  };
}
