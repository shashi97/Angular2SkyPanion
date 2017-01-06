import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/shared/dashboard.service';
import { SelectedCompanyDropdownModel } from './shared/company-dropdown.model';

export class CompanyFilterArguments {
  companyId: number = 0;
}
export class CompanyDropdownModel {
label: string = '';
value: SelectedCompanyDropdownModel = new SelectedCompanyDropdownModel();
}

@Component({
  selector: 'sp-company-dropdown',
  templateUrl: './company-dropdown.component.html',
})

export class CompanyDropdownComponent extends BaseComponent implements OnInit, OnChanges {

  @Output() public companyFiltered: EventEmitter<CompanyFilterArguments> = new EventEmitter<CompanyFilterArguments>();
  @Input() companyFilteredArg: CompanyFilterArguments = new CompanyFilterArguments();

  private companies: Array<any> = [];
  private selectedCompany: SelectedCompanyDropdownModel= new SelectedCompanyDropdownModel();

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private dashboardService: DashboardService
  ) {
    super(localStorageService, router);
    this.getSkypanionsCompanies();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getSkypanionsCompanies().then(res => {
      this.companies.map((item) => {
        if (item.value.CompanyID === this.companyFilteredArg.companyId) {
          this.selectedCompany = item.value;
        }
      });
    });

  }
  private getSkypanionsCompanies() {
    return this.dashboardService.getSkypanionsCompanies(false).then(result => {
      this.companies = result;
      // let temp = this.companies;
      let defaultRole = {
        CompanyID: 0, CompanyName: 'All Companies', Number: '', Type: '', account_id: 8
      };
      this.companies.splice(0, 0, defaultRole);

      let temp = this.companies;
      this.companies = [];

      temp.map((item: any) => {
        this.companies.push(
          { label: item.CompanyName, value: item });
      });
    });
    //  return this.companies;
  }

  private getSelectedCompany(selectedCompany): void {
    this.companyFilteredArg.companyId = selectedCompany.CompanyID;
    this.companyFiltered.emit(this.companyFilteredArg);
  }
}
