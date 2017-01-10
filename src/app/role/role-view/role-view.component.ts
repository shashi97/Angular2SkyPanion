import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../account/shared/account.service';
import { RoleService } from '../shared/role.service';
import { RoleModel } from '../shared/role.model';
import { PageHeaderTitleComponent } from '../../shared/others/page-header/page-header.component';
 import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
@Component({
  selector: 'sp-role-view',
  templateUrl: './role-view.component.html'
})

export class RoleViewComponent extends BaseComponent implements OnInit {

  private roleId: number;
  private searchString: string = '';
  private showLoader:boolean;
  public role: RoleModel;
  constructor(
    public localStorageService: LocalStorageService,
    public router: Router,
    private userService: UserService,
    private accountService: AccountService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
     public pubsub: PubSubService
  ) {
    super(localStorageService, router);
    this.role = new RoleModel();
  }

  ngOnInit() {
    this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
    if (this.user) {
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
      this.roleId = Number(params['id']);
      this.searchString =  this.roleId + '/' + pageSizeFilter + '/' + searchParameters ;
      this.getMemberRoleDetail();
    });
  };

  private getMemberRoleDetail(): void {
    this.location.replaceState('role/view/' + this.searchString);
    this.roleService.getMemberRoleDetail(this.roleId).then((result) => {
      if (result.status === 404 || result.status === 500) {
      } else {
        this.role = result;
      }
    });
  };
}
