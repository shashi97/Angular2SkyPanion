import { Http, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'Rxjs/Rx';
import { PurchaseOrderModel } from './purchaseOrder.model';
@Injectable()
export class PurchaseOrderSevice {
   private apiServiceBase= 'http://192.168.1.60:5009/';
   constructor(private http: Http) {

   }
private getPurchaseOrder() {

}


}
