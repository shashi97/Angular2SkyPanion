import { Component } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { VendorService } from './shared/vendor.service';
import { VendorModel } from './shared/vendor.model';
import {
  TableOptions,
  TableColumn,
  ColumnMode
} from 'angular2-data-table';

@Component({
  selector: 'skp-companies',
  templateUrl: './vendor.component.html',
  providers: [VendorService]
})

export class VendorComponent {

  private searchParameters: string = null;
  private currentPage: number = 1;
  private pageSize: number = 25;
  private vendorName: string = '';
  private vendorKey: string = '';
  private companyId: number = 0;
  private ledgerAccountId: number = 0;
  private totalItems: number ;
  private syncName: string = 'Sync Type';
  private companyType: string = 'Company Type';
  private vendorModel: VendorModel = new VendorModel();
     options = new TableOptions({
        columnMode: ColumnMode.force,
        headerHeight: 50,
        footerHeight: 50,
        rowHeight: 'auto',
        columns: [
            new TableColumn({ name: 'Vendor Key' }),
            new TableColumn({ name: 'Name' }),
            new TableColumn({ name: 'Account Number' }),
            new TableColumn({ name: 'Company Name' }),
            new TableColumn({ name: 'Phone #' })
        ]
    });

  constructor(private vendorSevice: VendorService) {
    this.vendorSevice
      .getVendors(
      this.ledgerAccountId,
      this.companyId,
      this.vendorName,
      this.vendorKey,
      this.currentPage,
      this.pageSize)
      .then(result => {
          //  if (result.status == 404) {
          //           $scope.gridData = [];
          //           $scope.totalItems = 0;
          //       }
                // else if (result.status == 500) {
                // }
                // else {
                     this.vendorModel.vendorsDetail = result;
                    // if (this.vendorModel != "" && $scope.gridData != []) {
                        if (this.vendorModel.vendorsDetail.length > 0) {
                            this.totalItems = this.vendorModel.vendorsDetail[0].VendorsCount;
                        } else {
                        this.totalItems = 0;
                    }
              //  }

                // var instanseId = paginationService.getLastInstanceId();
                // paginationService.setCurrentPage(instanseId, $scope.currentPage);
            // });
      });
    //  }
  }
}



