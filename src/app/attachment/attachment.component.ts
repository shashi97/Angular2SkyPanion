import { Component, OnInit } from '@angular/core';
import { Angular2DataTableModule } from 'angular2-data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../base.component';
import { UserService } from '../user/shared/user.service';
import { AttachmentObject } from '../attachment/shared/attachment.model';
import { AttachmentService } from '../attachment/shared/attachment.service';

import {
    TableOptions,
    TableColumn,
    ColumnMode
} from 'angular2-data-table';

@Component({
	selector: 'attachment',
	templateUrl: 'attachment.component.html'
})

export class AttachmentComponent extends BaseComponent implements OnInit {
    private model: Array<AttachmentObject>;
	constructor(private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private attachmentService: AttachmentService,
		localStorageService: LocalStorageService,
		router: Router) {
		super(localStorageService, router);
        this.model = new Array<AttachmentObject>();
		

	}
	ngOnInit() {
		this.sessionDetails = this.userService.getSessionDetails();
		if (this.sessionDetails.userId != null) {
			this.getAttachments();
		} else {
			let link = ['/login'];
			this.router.navigate(link);
		}
	}

    
   private getAttachments(): void {
       this.attachmentService
           .getAttachments()
           .then(result => {
               if (result) {
                   this.model = result;
                   console.log(this.model);
               }

           });

   }


}



