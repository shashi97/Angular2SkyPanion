import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';


export class ApprovalFilterArguments {
  type: string = '';
}

@Component({
  selector: 'sp-approval-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class ApprovalFilterComponent extends BaseComponent implements OnInit {

  @Output() filtered: EventEmitter<ApprovalFilterArguments> = new EventEmitter<ApprovalFilterArguments>();
  @Input() filteredValue: ApprovalFilterArguments = new ApprovalFilterArguments();

  constructor(
    localStorageService: LocalStorageService,
    router: Router
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }

  getApprovalCriteria(type) {
    this.filteredValue.type = type;
    this.filtered.emit(this.filteredValue);
  }
}
