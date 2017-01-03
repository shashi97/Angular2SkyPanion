//The pipe class implements the PipeTransform interface's transform method that accepts an input value and an optional array of parameters and returns the transformed value.
import { Pipe, PipeTransform } from '@angular/core';


//We tell Angular that this is a pipe by applying the @Pipe decorator which we import from the core Angular library.
@Pipe({
    //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.
    name: 'orderby'
})
export class OrderByPipe implements PipeTransform {
   transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Pipe({
    name: 'Filter'
})
export class VendorFilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(vendor=> vendor.VandorName.indexOf(filter) != -1) : value;
    }
}
@Pipe({
    name: 'AccountFilter'
})
export class AccountFilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(ledgerAccount=> ledgerAccount.LedgerAccount.indexOf(filter) != -1) : value;
    }
}
@Pipe({
    name: 'purchaseFilter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
       let filter = args;
       return filter ? value.filter(purchase=> purchase.NumberKey.indexOf(filter) != -1) : value;
       
    }
}



const PADDING = "000000";

@Pipe({ name: "CurrencyPipe" })
export class CurrencyPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
     var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

     if (negativeCheck[1] != undefined) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }
        if (decimalCheck[1] != undefined) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

    return clean;
  }
 
  parse(value: string, fractionSize: number = 2): string {

     var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

     if (negativeCheck[1] != undefined) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }
        if (decimalCheck[1] != undefined) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

    return clean;
  }

}

