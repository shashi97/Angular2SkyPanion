import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { JobModel } from '.././shared/job.model';

@Component({
    selector: 'sp-job-attribute',
    templateUrl: './attribute.component.html',
})

export class JobAttributeComponent extends BaseComponent implements OnInit {

    @Input() jobDetail: JobModel;

    constructor(
        localStorageService: LocalStorageService,
        router: Router,
    ) {
        super(localStorageService, router);
    }

    ngOnInit() {
    }
}
