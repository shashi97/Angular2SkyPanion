import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { CompanyService } from '../shared/company.service';


@Component({
  selector: 'sp-apt-company',
  templateUrl: './aptotals.component.html',
})

export class AptTotalsComponent extends BaseComponent implements OnInit {

  @Input() companyId: number;
  private companyChartDetail: any;
  private apTotals: boolean;
  private diskUsage: boolean;
  private syncInfo: boolean;
  private apTotalsNoData: boolean;
  private diskUsageNoData: boolean;
  private syncInfoNoData: boolean;
  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private companyService: CompanyService
  ) {
    super(localStorageService, router);
  }

  ngOnInit() {
    this.getCompanyChartData('ap_totals');
  }


  private getCompanyChartData(status: string): void {
    // this.setDefaultAptValue(status);
    this.companyService.getCompanyChartData(status, this.companyId).then(result => {
      {
        if (result.status !== 404 ) {
          this.apTotalsNoData = false;
          this.diskUsageNoData = false;
          this.syncInfoNoData = false;
          switch (status) {
            case 'ap_totals':
              this.apTotals = true;
              this.diskUsage = false;
              this.syncInfo = false;
              break;
            case 'disk_usage':
              this.apTotals = false;
              this.diskUsage = true;
              this.syncInfo = false;
              break;
            case 'sync_info':
              this.apTotals = false;
              this.diskUsage = false;
              this.syncInfo = true;
              break;

            default:
              break;
          }

        } else {

          this.apTotals = false;
          this.diskUsage = false;
          this.syncInfo = false;
          switch (status) {
            case 'ap_totals':
              this.apTotalsNoData = true;
              this.diskUsageNoData = false;
              this.syncInfoNoData = false;
              this.companyChartDetail = '';
              break;
            case 'disk_usage':
              this.apTotalsNoData = false;
              this.diskUsageNoData = true;
              this.syncInfoNoData = false;
              this.companyChartDetail = '';
              break;
            case 'sync_info':
              this.apTotalsNoData = false;
              this.diskUsageNoData = false;
              this.syncInfoNoData = true;
              this.companyChartDetail = '';
              break;

            default:
              break;
          }
        }

        this.companyChartDetail = result;
      }
    });
  };
<<<<<<< HEAD
=======


  private setDefaultAptValue(status: string): void {

    switch (status) {
      case 'ap_totals':
        this.apTotalsNoData = true;
        this.diskUsageNoData = false;
        this.syncInfoNoData = false;
        this.companyChartDetail = '';
        break;
      case 'disk_usage':
        this.apTotalsNoData = false;
        this.diskUsageNoData = true;
        this.syncInfoNoData = false;
        this.companyChartDetail = '';
        break;
      case 'disk_usage':
        this.apTotalsNoData = false;
        this.diskUsageNoData = false;
        this.syncInfoNoData = true;
        this.companyChartDetail = '';
        break;

      default:
        break;
    }

  }
>>>>>>> 3a3fc013925993772dcd93606b31c385ef2d12e0
}
