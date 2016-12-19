import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'sp-invoice-detail-check',
  templateUrl: './check-detail.component.html',
})

export class InvoiceCheckDetailComponent extends BaseComponent implements OnInit {

  @Input() checkDetails: Array<any>;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}
