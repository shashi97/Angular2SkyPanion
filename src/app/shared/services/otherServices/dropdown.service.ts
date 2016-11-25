import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()

export class DropdownService {
    public temp:Array<any>=[];
  constructor(private http: Http) {
  }

  getDropdown(Arraydetail: any, selectedName: any) {
     // let str = selectedName.replace(/^"(.*)"$/, '$1');
      Arraydetail.map((item: any) => {
       this.temp.push(
       {label: item.Category, value: item});
  });
    return this.temp;
  }
}
