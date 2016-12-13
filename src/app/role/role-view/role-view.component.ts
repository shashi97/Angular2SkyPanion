import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';

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
    private parameterValue: any;
    private searchParameters: number;
    public role: RoleModel;
    constructor(
        public localStorageService: LocalStorageService,
        public router: Router,
        private userService: UserService,
        private accountService: AccountService,
        private roleService: RoleService,
        private route: ActivatedRoute
    ) {
        super(localStorageService, router);
         this.role = new RoleModel();
        this.getSessionDetails();

    }
    ngOnInit(): void { }

    private getSessionDetails(): void {
        this.sessionDetails = this.userService.getSessionDetails();
        if (this.sessionDetails.userId != null) {
            this.getMemberRoleDetail();
        } else {
            let link = ['/login'];
            this.router.navigate(link);
        }
    }

    private getMemberRoleDetail(): void {

        this.route.params.subscribe(params => {
            this.parameterValue = ((params) ? params : 1);
            if (this.parameterValue) {
                this.searchParameters = Number(this.parameterValue.searchParameters);
                this.roleId = Number(this.parameterValue.roleId);
            }
        });
            this.roleService.getMemberRoleDetail(this.roleId).then((result) => {
                if (result.status === 404 || result.status === 500) {
                } else {
                    this.role = result;
                }
            });

        };
    }
