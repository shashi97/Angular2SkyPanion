import { Directive,Input,Inject, HostListener, ElementRef, OnInit } from "@angular/core";
import { OrderByPipe,CurrencyPipe } from '../../shared/pipe/orderby';

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




@Directive({ selector: "[CurrencyFormatter]" })
export class CurrencyFormatterDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.parse(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.currencyPipe.parse(value);
  }

  @HostListener("keyup", ["$event.target.value"]) 
  onKeyUp(value) {
    this.el.value = this.currencyPipe.parse(value);
  }



}

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input()
    focus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    protected ngOnChanges() {
        this.element.nativeElement.focus();
    }
}




