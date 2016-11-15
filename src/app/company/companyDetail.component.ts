import { Component } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { MasterService } from "../shared/services/master.service";
import { CompanyService } from "./company.service";
import { AccountService } from "../account/account.service";
import { RoleService } from "../role/role.service";
import { SettingService } from "../setting/setting.service";

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';


@Component({
    selector: 'skp-companyDetail',
    templateUrl: './companyDetail.component.html',
    providers: [MasterService, CompanyService, AccountService, RoleService, SettingService]


})

export class CompanyDetailComponent {

    companyID: number = 1;//($routeParams.CompanyID) ? parseInt($routeParams.CompanyID) : 0;
    selectedProcessRole: Array<any> = [];
    selectedReviewRole: Array<any> = [];
    selectedApproveRole: Array<any> = [];
    selectedBatchRole: Array<any> = [];
    selectedDeleteRole: Array<any> = [];
    selectedApproverRole: Array<any> = [];
    selectedViewInvoicesRole: Array<any> = [];
    compSearchParameters = null + "," + 0 + ',' + this.companyID + ',' + 0 + ',' + 0 + ',' + null + ',' + null;
    searchParameters = -1;//($routeParams.SearchParameters) ? $routeParams.SearchParameters : -1;
    roles: Array<any> = [];
    filepath: Object = { path: null, Category: 14 };
    companyDetail : Object ={};

    constructor(private masterService: MasterService,
        private companyService: CompanyService,
        private accountService: AccountService,
        private roleService: RoleService,
        private settingService: SettingService) {
        this.getSessionDetails();
    }

    private getSessionDetails = function () {
        // $rootScope.sessionDetails = userService.getSessionDetails();
        // if ($rootScope.sessionDetails.UserID != null) {
        // if ($rootScope.sessionDetails.IsSuperUser == true) {
        this.getRoles();
        //   }
        //  else {
        //    window.location.href = "/#/dashboard";
        // }

        // }
    }
    private getRoles = function () {
        this.roleService.getRoles().subscribe(result => {
            if (result.status == 404) {
            }
            else if (result.status == 500) {
            }
            else {
                this.roles = result;

                var obj = { RoleID: 0, AccountID: 0, Name: 'None', Description: 'None' }

                this.roles.splice(0, 0, obj);

                this.getCompanyDetail();
            }
        });
    }

    private getCompanyDetail = function () {
        this.companyService.getCompanyDetail(this.companyID).subscribe(result => {
            if (result.status == 404) {
            }
            else if (result.status == 500) {
            }
            else {
                this.companyDetail = result;

                this.roles.forEach(function (item) {

                    if (item.RoleID == this.companyDetail.view_invoice_role_id) {
                        this.selectedViewInvoicesRole.selected = item;
                    }


                    if (item.RoleID == this.companyDetail.create_invoice_role_id) {
                        this.selectedProcessRole.selected = item;
                    }
                    if (item.RoleID == this.companyDetail.review_invoice_role_id) {
                        this.selectedReviewRole.selected = item;
                    }
                    if (item.RoleID == this.companyDetail.approve_invoice_role_id) {
                        this.selectedApproveRole.selected = item;
                    }
                    if (item.RoleID == this.companyDetail.batch_invoice_role_id) {
                        this.selectedBatchRole.selected = item;
                    }
                    if (item.RoleID == this.companyDetail.delete_invoice_role_id) {
                        this.selectedDeleteRole.selected = item;
                    }
                    if (item.RoleID == this.companyDetail.approver_override_role_id) {
                        this.selectedApproverRole.selected = item;
                    }
                });

                this.getCompanyChartData('ap_totals');
            }
        });
    }


    private getCompanyChartData = function (status) {
        this.companyService.getCompanyChartData(status, this.companyID).subscribe(result => {
            if (result.status == 404 || result.status == 500) {
                this.APTotals = false;
                this.DiskUsage = false;
                this.SyncInfo = false;
                if (status == 'ap_totals') {
                    this.APTotalsNoData = true;
                    this.DiskUsageNoData = false;
                    this.SyncInfoNoData = false;
                    this.companyChartDetail = '';
                }
                else if (status == 'disk_usage') {
                    this.APTotalsNoData = false;
                    this.DiskUsageNoData = true;
                    this.SyncInfoNoData = false;
                    this.companyChartDetail = '';
                }
                else if (status == 'sync_info') {
                    this.APTotalsNoData = false;
                    this.DiskUsageNoData = false;
                    this.SyncInfoNoData = true;
                    this.companyChartDetail = '';
                }
            }
            else {
                this.APTotalsNoData = false;
                this.DiskUsageNoData = false;
                this.SyncInfoNoData = false;
                if (status == 'ap_totals') {
                    this.APTotals = true;
                    this.DiskUsage = false;
                    this.SyncInfo = false;
                }
                else if (status == 'disk_usage') {
                    this.APTotals = false;
                    this.DiskUsage = true;
                    this.SyncInfo = false;
                }
                else if (status == 'sync_info') {
                    this.APTotals = false;
                    this.DiskUsage = false;
                    this.SyncInfo = true;
                }
                this.companyChartDetail = result;
            }
        });
    }



    private updateInvoiceRole = function (roleID, key) {
        this.companyService
            .updateCompanyInvoiceRole(roleID, key, this.companyID)
            .subscribe(result => {

            });
    }




    private DrawFullInvoiceChart = function () {
        // var colors = Highcharts.getOptions().colors;

        // function setChartForSalary(name, categories, data, color, Whatis) {
        //     console.log(name, categories, data, color);
        //     chartSal.xAxis[0].setCategories(categories);
        //     while (chartSal.series.length > 0) {
        //         chartSal.series[0].remove(true);
        //     }
        //     for (var i = 0; i < data.length; i++) {
        //         if (Whatis == "Main") {
        //             chartSal.addSeries({
        //                 name: data[i][i].BranchName,
        //                 data: data[i],
        //                 color: data[i][i].color
        //             });
        //         }
        //         else {
        //             chartSal.addSeries({
        //                 name: name,
        //                 data: data[i],
        //                 color: color
        //             });

        //         }
        //     }
        // }
        // chartSal = new Highcharts.Chart
        // (
        // {
        //     chart: {
        //         renderTo: 'divSalaryChart2',
        //         type: 'column'
        //     },
        //     labels:
        //     {
        //         text: '',
        //         enabled: false
        //     },
        //     title: {
        //         text: 'Salary Chart'
        //     },

        //     subtitle: {
        //         text: 'BranchWise Salary Chart.'
        //     },
        //     xAxis: {
        //         categories: MonthlistXAxis
        //         , labels: { rotation: -50, align: 'right' }
        //     },
        //     yAxis: {
        //         title: {
        //             text: 'Amount'
        //         }
        //     },
        //     plotOptions: {
        //         column: {
        //             cursor: 'pointer',
        //             point: {
        //                 events: {
        //                     click: function () {
        //                         var drilldown = this.drilldown;
        //                         if (drilldown) {
        //                             setChartForSalary(drilldown.name, drilldown.categories, [drilldown.data], drilldown.color, "drilldown");
        //                         } else {
        //                             setChartForSalary("name from db", MonthlistXAxis, $scope.DashBoardDetails[1], 'white', "Main");
        //                         }
        //                     }
        //                 }
        //             },
        //         }
        //     },

        //     tooltip: {
        //         formatter: function () {
        //             var point = this.point,
        //                 series = point.series,
        //                 s = 'Amount' + '<br/>' + this.x + ' ' + series.name + ' is <b>' + this.y + '</b><br/>';
        //             if (point.drilldown) {
        //                 s += 'Click to view <b>' + point.category + ' ' + series.name + ' </b>' + ' by CompanyBranch';
        //             } else {
        //                 s += 'Click to return to view by Branch.';
        //             }
        //             return s;
        //         }
        //     },

        //     series: [{

        //     }
        //     ],


        //     exporting: {
        //         enabled: false
        //     }
        // },
        // function (chartSal) {
        //     console.log(chartSal);
        //     while (chartSal.series.length > 0) {
        //         chartSal.series[0].remove(true);
        //     }
        //     for (var i = 0; i < $scope.DashBoardDetails[1].length; i++) {
        //         chartSal.addSeries({
        //             name: $scope.DashBoardDetails[1][i][i].BranchName,
        //             data: $scope.DashBoardDetails[1][i],
        //             color: $scope.DashBoardDetails[1][i][i].color
        //         });
        //     }
        // });

    }


    private getDirectories = function (filepath, category) {
        if (filepath == "") {
            filepath == null;
        }

        if (category == "14") {
            category = 14;
        }
        this.filepath.path = filepath;
        this.filepath.Category = category;

        if (category == 14 || category == 0 || category == 10) {
            this.settingService.getServerDirectoriesfiles(this.filepath).subscribe(result => {
                if (result.status == 404) {
                    this.Serverfiles = [];
                }
                else if (result.status == 500) {
                }
                else {
                    this.Serverfiles = result;
                }
            });
        }
    }

    private getFilepath = function (path) {
        this.filepath.path = path;
    }

    private getParentDirectory = function () {
        if (this.filepath.Category != 14) {
            var path = this.filepath.path.substr(0, (this.filepath.path.lastIndexOf("/") + 1))
            if (path.match(/\//g).length == 1) {

                this.getDirectories(null, 14);
            }
            else {
                this.getDirectories(path, this.filepath.Category);
            }

        }
    }

    private saveFolderPath = function (path) {
        this.companyDetail.PdfFolderPath = path;
        this.companyService.updateCompanypdfFolderPath(this.companyDetail).subscribe(result => {

            //$('.closeButton').trigger('click');
        });
    }

}