import { Component, OnChanges, Input, Output, ChangeDetectorRef } from '@angular/core';
import { MasterService } from '../shared/services/master/master.service';


@Component({
    selector: 'sp-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {


    public pageSizeFilter: number;
    private pageSize: number = 25;
    private totalItems: number= 100;
    private maxPage: number;
    private itemsPerPageList: Array<number> = [];
    @Input()
    public currentPageChanged: (pageNo) => void;
    @Input()
    public pageSizeFilterChanged: (pageSize, maxPageNo) => void;

    //     @Output()
    //     public get currentPageNo() :(number) {
    //         return this._currentPageNo;
    //     }
    //     public set currentPageNo(newValue:number) {
    //      this._currentPageNo=newValue;
    //   }
    private _dataSource: Array<any> = [];
    private currentPageNo: number = 1;
    public maxPageNo: number;
    @Input()
    public get dataSource(): Array<any> {
        return this._dataSource;
    }
    public set dataSource(newvalue: Array<any>) {
        this._dataSource = newvalue;
        this.maxPageNo = this.dataSource.length / this.pageSizeFilter;
        this.changeDetectorRef.markForCheck();
    }


    // public get maxPageNo(): number {
    //     return this._maxPageNo;//=return this.dataSource.length / 25;

    // };
    // public set maxPageNo(newValue):number {
    //     this._maxPageNo= this.dataSource.length / 25;

    // }
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public masterService: MasterService) {

    }

    ngOnChanges(): void {
        console.log(this.maxPageNo);
        this.setItemsPerPageList();
    }

    private setItemsPerPageList(): void {
        this.itemsPerPageList = this.masterService.getItemsPerPageList();
        this.pageSizeFilter = 25;

    }

    // private pageChangeHandler(): void {

    //     //  this.getJobs();
    // };
    private getDataAsPerPerPageRequired(value: number): void {
        if (value !== undefined && value !== null) {
            this.pageSizeFilter = value;
            this.maxPageNo = this.dataSource.length / this.pageSizeFilter;
            this.pageSizeFilterChanged(this.pageSizeFilter,  this.maxPageNo);
          }
    }

    private pageChangeHandler(): void {
        this.currentPageChanged(this.currentPageNo);
    }
}
