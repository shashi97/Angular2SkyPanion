import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { CompaniesService } from './shared/companies.service';
import { CompaniesModel } from './shared/companies.model';
import { UserService } from '../user/shared/user.service';
import { BaseComponent } from '../base.component';
import { ConfirmService } from '../shared/services/otherServices/confirmService';


import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'sp-companies',
  templateUrl: './companies.component.html',
  providers: [CompaniesService]
})
export class CompaniesComponent extends BaseComponent implements OnInit {
  options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    columns: [
      new TableColumn({ prop: 'Number', cellTemplate: '' }),
      // new TableColumn({ prop: 'Name' }),
      new TableColumn({ name: 'Name', prop: 'Name' }),
      new TableColumn({ prop: 'Sync' })
    ]
  });

  private currentPage: number = 1;
  private pageSize: number = 25;
  private syncId: string = '-1';
  private syncTypeId: string = '-1';
  private searchText: string = null;
  private syncName: string = 'Sync Type';
  private companyType: string = 'Company Type';
  private title: string = 'Companies';
  private companiesModel: CompaniesModel = new CompaniesModel();
  private totalItems: number;
  constructor(
    private companiesService: CompaniesService,
    private userService: UserService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public confirmService: ConfirmService) {
    super(localStorageService, router);
    this.getSessionDetails();
  }
    ngOnInit(): void {}
  private getSessionDetails(): void {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getCompanies();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  private getCompanies() {
    this.companiesService
      .getCompanies(this.syncId,
      this.syncTypeId,
      this.searchText,
      this.currentPage,
      this.pageSize)
      .then(result => {
        //  if (result.status == 404) {
        // this.companiesModel=new CompaniesModel();
        // this.totalItems = 0;
        //   }
        // else if (result.status == 500) {
        //  }
        //  else {
        this.companiesModel.companiesDetail = result;
        this.totalItems = this.companiesModel.companiesDetail[0].CompanyCount;

        this.companiesModel.companiesDetail.forEach((item) => {
          if (item.type === 'Skypanion::Property') {
            // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> "
            //     + item.LedgerAccountCount + 
            //     "<br /><b>Invoices:</b> "
            //     + item.InvoiceCount
            //     + "<br /><b>Vendors:</b> "
            //     + item.VendorCount 
            //     + "<br /><b>PDFs:</b> " 
            //     + item.PDFCount 
            //     + "<br /><b>Purchase Orders:</b> " 
            //     + item.PurchaseOrderCount 
            //     + "<br /><b>Approval Criteria:</b> " 
            //     + item.ApprovalCriteriaCount + "<br />");
          } else {
            // // item.htmlBody = $sce.trustAsHtml("<b>Ledger Accounts:</b> " 
            // + item.LedgerAccountCount 
            // + "<br /><b>Invoices:</b> " 
            // + item.InvoiceCount 
            // + "<br /><b>Vendors:</b> " 
            // + item.VendorCount 
            // + "<br /><b>PDFs:</b> " 
            // + item.PDFCount 
            // + "<br /><b>Purchase Orders:</b> " 
            // + item.PurchaseOrderCount 
            // + "<br /><b>Approval Criteria:</b> " 
            // + item.ApprovalCriteriaCount 
            // + "<br /><b>Posts:</b> " 
            // + item.FundCount + "<br />");
          }
        });
      });
    //  }

  }
// after achieving datatable all feature we will make this .. 
  activateDeactiveCompany(companyName: string, CompanyId: number, Active: boolean): void {
    let isActive = null;
    if (Active === true) {
      let message = 'Are you Sure you' + 'd like to disable property ';
      if (this.confirmService.confermMessage(message, companyName)) {
        isActive = false;
        this.disableProperty(CompanyId, isActive);
      }
    } else {
      let message = 'Are you Sure you' + 'd like to enable property ';
      if (this.confirmService.confermMessage(message, companyName)) {
        isActive = true;
        this.disableProperty(CompanyId, isActive);
      }

    }
  }

  private disableProperty(CompanyId: number, isActive: boolean): void {
    this.companiesService
      .activateDeactiveCompany(CompanyId, isActive)
      .then((result) => {
        this.getSessionDetails();
      });
  }
}

                /// var instanseId = paginationService.getLastInstanceId();
                ///  paginationService.setCurrentPage(instanseId, $scope.currentPage);
            // });
    // }




