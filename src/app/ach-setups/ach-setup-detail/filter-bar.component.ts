import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { AchSetupModel } from '../shared/ach-setup.model';

@Component({
  selector: 'sp-ach-setup-filter-bar',
  templateUrl: './filter-bar.component.html',
})

export class AchSetupFilterBarComponent extends BaseComponent implements OnInit {

  @Input() achSetupDetail: AchSetupModel;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
  }
}