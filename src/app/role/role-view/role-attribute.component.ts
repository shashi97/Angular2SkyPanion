import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { RoleModel } from '../shared/role.model';


@Component({
    selector: 'sp-role-attribute',
    templateUrl: './role-attribute.component.html',
})

export class RoleAttributeComponent extends BaseComponent implements OnInit {

    @Input() role: RoleModel;

    constructor(
        localStorageService: LocalStorageService,
        router: Router
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
