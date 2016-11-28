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
  // private searchParameters: number;
  private companyChartDetail: any;
  private apTotals: boolean = false;
  private diskUsage: boolean = false;
  private syncInfo: boolean = false;
  private apTotalsNoData: boolean = false;
  private diskUsageNoData: boolean = false;
  private syncInfoNoData: boolean = false;
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
    this.setDefaultAptValue(status);
    this.companyService.getCompanyChartData(status, this.companyId).then(result => {
      {
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
        this.companyChartDetail = result;
      }
    }).catch(function (params: any) {
      if (params.status === 404 || params.status === 500) {
        // this.apTotals = false;
        // this.diskUsage = false;
        // this.syncInfo = false;
        // if (status === 'ap_totals') {
        //   this.apTotalsNoData = true;
        //   this.diskUsageNoData = false;
        //   this.syncInfoNoData = false;
        //   this.companyChartDetail = '';
        // } else if (status === 'disk_usage') {
        //   this.apTotalsNoData = false;
        //   this.diskUsageNoData = true;
        //   this.syncInfoNoData = false;
        //   this.companyChartDetail = '';
        // } else if (status === 'sync_info') {
        //   this.apTotalsNoData = false;
        //   this.diskUsageNoData = false;
        //   this.syncInfoNoData = true;
        //   this.companyChartDetail = '';
        // }
      }
    });
  };


  private setDefaultAptValue(status: string) {

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
}
