import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

@Component({
    selector: 'sp-role-filter-bar',
    templateUrl: './filter-bar.component.html'
})
export class RoleFilterComponent extends BaseComponent implements OnInit {

    @Input() roleName: string;
    // public onsyncTypeChanged(newValue: RoleArgument) {
    //     this.syncTypeFiltered = newValue;
    // }
    constructor(
        localStorageService: LocalStorageService,
        router: Router
    ) {
        super(localStorageService, router);
        // console.log(this.vendorDetail);

    }

    ngOnInit() { }

    private searchURL(): void {
        this.router.navigate(['/role/' + this.roleName]);
    }

    private searchURLReset (): void {
        this.roleName = '';
        this.searchURL();
    }
}
