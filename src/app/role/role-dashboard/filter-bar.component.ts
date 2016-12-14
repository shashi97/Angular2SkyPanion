import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

export class RoleFilterArgument {
  roleName: string = '';
}
@Component({
  selector: 'sp-role-filter-bar',
  templateUrl: './filter-bar.component.html'
})
export class RoleFilterComponent extends BaseComponent implements OnInit {

  @Output() filtered: EventEmitter<RoleFilterArgument> = new EventEmitter<RoleFilterArgument>();
  @Input() rolefilteredValue: RoleFilterArgument;

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() { }

  private searchURL(): void {
    this.filtered.emit(this.rolefilteredValue);
  }

  private searchURLReset(): void {
    this.rolefilteredValue.roleName = '';
    this.searchURL();
  }
}
