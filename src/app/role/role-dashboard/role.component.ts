import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../user/shared/user.service';
import { BaseComponent } from '../../base.component';
import { ConfirmService } from '../../shared/services/otherServices/confirmService';
import {CurrentPageArguments} from '../../pagination/pagination.component';
import { AccountService } from '../../account/shared/account.service';
import { RoleService } from '../shared/role.service';
import { RoleModel } from '../shared/role.model';
import { RoleFilterArgument } from './filter-bar.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
    selector: 'sp-role-dashboard',
    templateUrl: './role.component.html'

})
export class RoleComponent extends BaseComponent implements OnInit {

    private account: Object;
    private roleName: string = null;
    private totalItems: number;
    private roles: Array<RoleModel>;
    private _currentPage: CurrentPageArguments = new CurrentPageArguments();
    private pageName: string = 'roles';
    private parameterValue: any;
    private _filterRow: RoleFilterArgument = new RoleFilterArgument();
    constructor(
        public localStorageService: LocalStorageService,
        public router: Router,
        private userService: UserService,
        private accountService: AccountService,
        private roleService: RoleService,
        private route: ActivatedRoute,
        private confirmService: ConfirmService,
        public toastr: ToastsManager
    ) {
        super(localStorageService, router);
        this.roles = new Array<RoleModel>();
        this.getSessionDetails();
    }
    ngOnInit(): void { }
    private get currentPageFiltered(): CurrentPageArguments {
        return this._currentPage;
    }
    private set currentPageFiltered(newValue: CurrentPageArguments) {
        this._currentPage = newValue;
        this.getRoles();
    }
    private get rolefilteredValue(): RoleFilterArgument {
        return this._filterRow;
    }

    private set rolefilteredValue(newValue: RoleFilterArgument) {
        this._filterRow = newValue;
    }
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
        this.route.params.subscribe(params => {
            this.parameterValue = ((params) ? params : 1);
            if (this.parameterValue.SearchParameters) {
                let parameterArray: Array<string> = this.parameterValue.SearchParameters.split(',');
                this.rolefilteredValue.roleName = parameterArray[0];
            }
            this.getAccountName();
        });
    }

    private getAccountName(): void {
        this.accountService.getAccountName().then(result => {
            this.account = result;
            this.getRoles();
        });
    }

    public onCurrentPageChanged(newValue: CurrentPageArguments) {
        this.currentPageFiltered = newValue;
    }


    private getRoles(): void {

        // if ($scope.pageSizeFilter != null) {
        //     $scope.pageSize = $scope.pageSizeFilter;
        // }

        // if ($scope.roleName == "" || $scope.roleName == undefined || $scope.roleName == "null")
        // {
        //     $scope.roleName = null;
        // }

        this.roleService.getRoleList(
            this.rolefilteredValue.roleName,
            this.currentPageFiltered.pageNo,
            this.currentPageFiltered.pageSizeFilter
        ).then((result) => {
            if (result.status === 404) {
                this.roles = [];
                this.totalItems = 0;
            } else if (result.status === 500) {
            } else {
                this.roles = result;

                if (this.roles.length > 0) {
                    this.totalItems = this.roles[0].RoleCount;
                } else {
                    this.totalItems = 0;
                }
            }
        });
    }


    private deleteRole(roleId, roleName): void {

        let message = 'Are you sure you' + 'd like to delete';
        if (this.confirmService.confermMessage(message, roleName)) {
            this.roleService.deleteRole(roleId).then((result) => {
                if (result.status === 404 || result.status === 500) {
                    this.toastr.error(result.data.ExceptionMessage, 'Oops!');
                    // messageService.showMsgBox("Error", result.data.ExceptionMessage, "error");
                } else {
                    this.toastr.success('Role successfully deleted.', 'Success!');
                    // messageService.showMsgBox("Success", "Role successfully deleted.", "success");
                    this.getRoles();
                }
            });

        }

    }

    public onRoleFiltered(filteredValue: RoleFilterArgument): void {
        this.rolefilteredValue = filteredValue;
    }

}
