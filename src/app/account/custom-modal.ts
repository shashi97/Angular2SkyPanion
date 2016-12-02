import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class AdditionCalculateWindowData extends BSModalContext {
  constructor(public num1: number, public num2: number) {
    super();
  }
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  styles: [],
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */ template: `
        <div class="container-fluid custom-modal-container">
            <div class="row custom-modal-header">
                <div class="col-sm-12">
                    <h1>A Custom modal design</h1>
                </div>
            </div>
            <div class="row" [ngClass]="{'myclass' : shouldUseMyClass}">
                <div class="col-xs-12">
                    <div class="jumbotron">
                        <h1>Do the math to quit:</h1>
                        <p class="lead">I received an injection of the number <strong>{{context.num1}}</strong> and the number <strong>{{context.num2}}</strong></p>
                        <span>What is the sum?</span>
                         <input class="form-control" type="text" #answer (keyup)="onKeyUp(answer.value)" autofocus>
                    </div>
                </div>
            </div>
        </div>`
})
export class CustomModal implements ModalComponent<AdditionCalculateWindowData> {
  context: AdditionCalculateWindowData;

  public wrongAnswer: boolean;

  constructor(public dialog: DialogRef<AdditionCalculateWindowData>) {
    this.context = dialog.context;
     dialog.setCloseGuard(this);
    this.wrongAnswer = true;
  }

  onKeyUp(value) {
    this.wrongAnswer = value != 5;
    this.dialog.close();
  }


  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return this.wrongAnswer;
  }
}
