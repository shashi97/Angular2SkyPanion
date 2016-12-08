import { Directive, ElementRef } from '@angular/core';
@Directive({ selector: '[showOnRowHover]' })
export class ShowOnRowHover {
    constructor(el: ElementRef) {
       el.nativeElement.closed('tr').bind('mouseenter',
       function() {
         el.nativeElement.show();
       });
        el.nativeElement.closed('tr').bind('mouseleave',
       function() {
         el.nativeElement.hide();
         var contextmenu =  el.nativeElement.find('#contextmenu');
         contextmenu.click();
         el.nativeElement.parent().removeClass('open');
       });
      // e1.nativeElement.closed('tr')

}
};

