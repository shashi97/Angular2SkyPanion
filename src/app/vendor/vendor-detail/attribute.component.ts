import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { VendorModel } from '../shared/vendor.model';

@Component({
    selector: 'sp-vendor-detail-attribute',
    templateUrl: './attribute.component.html',
})

export class VendorDetailAttributeComponent extends BaseComponent implements OnInit {

    @Input() vendorDetail: VendorModel;

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
