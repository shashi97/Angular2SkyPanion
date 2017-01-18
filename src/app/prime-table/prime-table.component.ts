import { Component, OnInit, Pipe, ViewContainerRef, Input, OnChanges, Output, EventEmitter, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base.component';
import { AttachmentService } from '../attachment/shared/attachment.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { AttachmentObject, attachmentdata } from '../attachment/shared/attachment.model';

@Component({
  selector: 'prime-table',
  templateUrl: 'prime-table.component.html'
})

export class PrimeTableComponent extends BaseComponent implements OnInit {
  private attachmentObject: attachmentdata;
  private attachments: Array<AttachmentObject>;
   cols: any[];
    constructor(private activatedRoute: ActivatedRoute,
    vcRef: ViewContainerRef,
    router: Router,
    private attachmentService: AttachmentService,
     localStorageService: LocalStorageService
    ) {
    super(localStorageService, router);
    this.attachments = new Array<AttachmentObject>();
  }

    ngOnInit() {
        this.getAttachments();
        this.cols = [
            {field: 'Info', header: 'Vin'},
            {field: 'CompanyName', header: 'Year'},
            {field: 'Name', header: 'Brand'},
            {field: 'Uploaded', header: 'Color'}
        ];
    }

    private getAttachments(): void {
    this.attachmentService
      .getAttachments(null, null, 1, 25)
      .then(result => {
        if (result) {
          this.attachments = result;
        }
      });
  }
}

