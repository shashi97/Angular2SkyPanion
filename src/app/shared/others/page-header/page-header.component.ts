import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

export class TitleModel {
  pageName: string;
}


@Component({
    selector: 'sp-page-header-title',
    templateUrl: './page-header.component.html',
})

export class PageHeaderTitleComponent extends BaseComponent implements OnInit {

     @Input()
    public pageName: string = '';

    constructor(
        localStorageService: LocalStorageService,
        router: Router
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
