// import * as $ from 'jquery';
import * as moment from 'moment';
import {SetOptions} from 'eonasdan-bootstrap-datetimepicker';
	
declare var $:any;
import {
    Directive,
    ElementRef,
    Renderer,
    Input,
    OnInit,
    EventEmitter,
    Output,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerDirective),
    multi: true
};

@Directive({
  selector: '[datetimepicker]',
   providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DateTimePickerDirective implements OnInit, OnChanges , ControlValueAccessor {

    @Input() ngModel:Date
    @Input() options: SetOptions;
 
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();  
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
    private dpElement;

    constructor(el: ElementRef, renderer: Renderer) {
        let $parent = $(el.nativeElement.parentNode);
        this.dpElement = $parent.hasClass('input-group') ? $parent : $(el.nativeElement);
    }

    ngOnInit(): void {
       
         this.dpElement.datetimepicker(this.options);
        this.dpElement.data('DateTimePicker').date(this.ngModel);

        this.dpElement.on('dp.change', (e) => {
            if (e.date.valueOf() !== this.ngModel.valueOf()) {
                this.ngModel = e.date;
                // this.onChange.emit(e.date);
             let dateTime = moment(e.date).format("MM/DD/YYYY");
              this.ngModelChange.emit(dateTime);
            }
        });

        // this.dpElement.on('click', () => this.onClick.emit());
        this.ngModelChange.emit(this.ngModel);
    }

    ngOnChanges(changes: SimpleChanges): void {
        let dpe = this.dpElement.data('DateTimePicker');

        if (!!dpe) {
            let options = changes['options'];
            let date = changes['date'];

            if (!!options) {
                $.map(options.currentValue, (value, key) => {
                    dpe[key](value);
                });
            }

            if (!!date) {
              dpe.date(date.currentValue);
                  let dateTime = moment(this.ngModel).format("MM/DD/YYYY");
              this.ngModelChange.emit(dateTime);
                // this.ngModelChange.emit(this.ngModel)
            }
        }
    }
  
     //From ControlValueAccessor interface
    writeValue(value: any) {
      this.ngModel=value
        // if (value !== this.innerValue) {
        //     this.innerValue = value;
        // }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.ngModel = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.ngModel = fn;
    }
}
