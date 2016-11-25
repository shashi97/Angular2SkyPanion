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