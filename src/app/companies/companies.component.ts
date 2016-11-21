import { Component } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { CompaniesService } from './shared/companies.service';
import { CompaniesModel, CompanyInfo } from './shared/companies.model';

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
export class CompaniesComponent {
    options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ prop: 'Number' }),
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
    private companiesModel: CompaniesModel= new CompaniesModel();
    private totalItems: number;
    constructor(private companiesService : CompaniesService) {
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
}

                /// var instanseId = paginationService.getLastInstanceId();
                ///  paginationService.setCurrentPage(instanseId, $scope.currentPage);
            // });
    // }




