import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

export class RoleFilterArgument {
roleName: string= null;
}
@Component({
    selector: 'sp-role-filter-bar',
    templateUrl: './filter-bar.component.html'
})
export class RoleFilterComponent extends BaseComponent implements OnInit {

   @Output() filtered: EventEmitter<RoleFilterArgument> = new EventEmitter<RoleFilterArgument>();
   @Input() rolefilteredValue: RoleFilterArgument;
  //  @Input() roleName: string;
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
        this.filtered.emit(this.rolefilteredValue);
        this.router.navigate(['/role/' + this.rolefilteredValue.roleName]);
    }

    private searchURLReset (): void {
        this.rolefilteredValue.roleName = '';
        this.searchURL();
    }
}
