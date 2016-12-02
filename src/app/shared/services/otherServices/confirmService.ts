import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()

export class ConfirmService {
  constructor(private http: Http) {
  }

  confermMessage(message: string , CompanyName ?: string ) {
     let r = confirm(message + CompanyName);
    return r;
  }
}
