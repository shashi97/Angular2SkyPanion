import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { UserService } from '../../user/shared/user.service';
import { AchSetupService } from '../shared/ach-setup.service';

import { AchSetupModel } from '../shared/ach-setup.model';

@Component({
  selector: 'sp-ach-setup-detail',
  templateUrl: './ach-setup-detail.component.html',
})

export class AchSetupDetailComponent extends BaseComponent implements OnInit {
  private achSetupDetail: AchSetupModel;
  private id: number = 0;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private userService: UserService,
    private achSetupService: AchSetupService,
    private activatedRoute: ActivatedRoute
  ) {
    super(localStorageService, router);
    this.achSetupDetail = new AchSetupModel();
    this.getParameterValues();
  }

  ngOnInit() {
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getSessionDetails();
    });
  }

  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId && this.user.IsSuperUser) {
      this.getachSetupDetail();

    } else {
      let link = ['/company'];
      this.router.navigate(link);
    }
  }

  private getachSetupDetail(): void {
    this.achSetupService.getachSetupDetail(this.id).then(result => {
      this.achSetupDetail = result;
    });
  }
}
