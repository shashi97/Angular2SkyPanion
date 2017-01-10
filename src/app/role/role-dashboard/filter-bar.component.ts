import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import {PubSubService} from '../../interceptor/pub-service';
import { LoadingSpinnerComponent} from '../../shared/loading-spinner/loading-spinner.component';
export class RoleFilterArgument {
  roleName: string = '';
}
@Component({
  selector: 'sp-role-filter-bar',
  templateUrl: './filter-bar.component.html'
})
export class RoleFilterComponent extends BaseComponent implements OnInit {
  private showLoader:boolean;
  
  @Output() filtered: EventEmitter<RoleFilterArgument> = new EventEmitter<RoleFilterArgument>();
  @Input() rolefilteredValue: RoleFilterArgument;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    public pubsub: PubSubService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
     this.pubsub.beforeRequest.subscribe(data => this.showLoader = true);
      this.pubsub.afterRequest.subscribe(data => this.showLoader = false);
   }

  private searchURL(): void {
    this.filtered.emit(this.rolefilteredValue);
  }

  private searchURLReset(): void {
    this.rolefilteredValue.roleName = '';
    this.searchURL();
  }
}
