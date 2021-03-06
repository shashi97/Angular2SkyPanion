import { Component, Pipe, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../../base.component';
import { UserService } from '../../../user/shared/user.service';
import { CurrentPageArguments } from '../../../pagination/pagination.component';
import { CrumbBarComponent } from '../../../shared/others/crumb-bar/crumb-bar.component';
import { InvoiceEntryService } from '../../../invoice/invoice-entry/shared/invoice-entry.service';
import { PurchaseOrder } from '../../../invoice/invoice-entry/shared/invoice-entry.model';
// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';
// import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
// import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FilterPipe } from '../../../shared/pipe/orderby';
import { FocusDirective } from '../../../shared/directive/showOnRowHover';

export class InvoiceEntryPurchaseModalContext extends BSModalContext {
  constructor() {
    super();
  }
}



@Component({
  selector: 'sp-invoice-entry-purchase',
  templateUrl: 'invoice-entry-purchase.component.html',
   styleUrls: ['../../../dashboard/css/dashboard-invoices-distribution.css'],
   providers:[FocusDirective]
})
export class InvoiceEntryPurchaseComponent extends BaseComponent implements CloseGuard, ModalComponent<InvoiceEntryPurchaseModalContext>, OnInit {
  // export class InvoiceEntryPurchaseComponent extends BaseComponent implements OnInit {
  private purchaseOrder: Array<any>
  context: InvoiceEntryPurchaseModalContext;
  public wrongAnswer: boolean;
  private POSearchText: string = '';
  private PuchaseOrderID: number = 0;
   private inputFocused = true;
  // @ViewChild('templateRef') public templateRef: TemplateRef<any>;
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private invoiceEntryService: InvoiceEntryService,
    localStorageService: LocalStorageService,
    router: Router,
    public dialog: DialogRef<InvoiceEntryPurchaseModalContext>) {
    super(localStorageService, router);
    this.context = dialog.context;
    this.dialog.context.dialogClass = 'modal-dialogss';
    dialog.setCloseGuard(this);
    this.inputFocused = true;
    this.getPurchaseOrders();

  }
  ngOnInit() {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      this.getPurchaseOrders()
      // this.getAccountName();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  public getPurchaseOrders(): void {
    this.invoiceEntryService
      .getPurchaseOrders()
      .then(result => {
        if (result.status == 404) {
        }
        else if (result.status == 500) {
        } else {
          this.purchaseOrder = result;
        }
      });

  }
  GetSelectedPurchaseOrder(PuchaseOrderID): void {
    this.dialog.close(PuchaseOrderID);
    //	this.PuchaseOrderID = PuchaseOrderID;
  }
// $(window).click ():void {
// //Hide the menus if visible
// };
  closeModal(): void {
    this.dialog.close();

  }
}


