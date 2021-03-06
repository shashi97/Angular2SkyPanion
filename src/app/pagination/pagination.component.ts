import { Component, OnChanges, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MasterService } from '../shared/services/master/master.service';

export class CurrentPageArguments {
    pageNo: number= 1;
    toPage: number = 0;
    fromPage: number = 0;
    pageSizeFilter: number = 25;
    isShowPage: boolean = false;
    validatePageSize: boolean = false;
    validateTotalItems: boolean = false;
}

@Component({
    selector: 'sp-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {


    public pageSizeFilter: number;
    private itemsPerPageList: Array<number> = [];

    @Output()
    public currentPageChanged: EventEmitter<CurrentPageArguments> = new EventEmitter<CurrentPageArguments>();
    @Input() currentPageFiltered: CurrentPageArguments = new CurrentPageArguments();
    // @Input()
    // public pageSizeFilterChanged: (pageSize) => void;

    //     @Output()
    //     public get currentPageNo() :(number) {
    //         return this._currentPageNo;
    //     }
    //     public set currentPageNo(newValue:number) {
    //      this._currentPageNo=newValue;
    //   }
    private _dataSource: Array<any> = [];
    private _totalItems: number;
    public maxPageNo: number;
    public totalItem: number;

    @Input()
    public get dataSource(): Array<any> {
        return this._dataSource;
    }
    public set dataSource(newvalue: Array<any>) {
        this._dataSource = newvalue;
        this.changeDetectorRef.markForCheck();
    }
    @Input()
    public get totalItems(): number {
        return this._totalItems;
    }
    public set totalItems(newvalue: number) {
        this._totalItems = newvalue;
    }

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
        // this.currentPageFiltered.pageSizeFilter = 25;
        this.setPageSumDisplay();

    }

    private getDataAsPerPerPageRequired(value: number): void {
        if (value !== undefined && value !== null) {
            this.currentPageFiltered.pageSizeFilter = value;
           // this.currentPageFiltered = new CurrentPageArguments();
            this.currentPageFiltered.pageNo = 1;
            this.pageChangeHandler();
        }
    }

    private pageChangeHandler(): void {
         // this.currentPageFiltered.pageNo = 1;
        this.setPageSumDisplay();
        this.currentPageChanged.emit(this.currentPageFiltered);
    }


    private onPageChanged(pageSetting: any) : void {
        this.currentPageFiltered.pageNo = pageSetting.page;
        this.currentPageChanged.emit(this.currentPageFiltered);
    }
    private setPageSumDisplay(): void {
        this.currentPageFiltered.fromPage = this.currentPageFiltered.pageNo * this.currentPageFiltered.pageSizeFilter;
        this.currentPageFiltered.toPage = this.currentPageFiltered.fromPage -
            this.currentPageFiltered.pageSizeFilter + 1;
    }
}
