import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { BaseComponent } from '../../base.component';
import { UserService } from '../../user/shared/user.service';

import { CurrentPageArguments } from '../../pagination/pagination.component';
import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

// import { CompanyDropdownComponent } from '../shared/dropdown/company/company-dropdown.component';

@Component({
  selector: 'sp-invoice-entry',
  templateUrl: 'invoice-entry.component.html'
})

export class InvoiceEntryComponent extends BaseComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    localStorageService: LocalStorageService,
    router: Router) {
    super(localStorageService, router);

  }
  ngOnInit() {
    this.sessionDetails = this.userService.getSessionDetails();
    if (this.sessionDetails.userId != null) {
      // this.getAttachments();
      // this.getAccountName();
    } else {
      let link = ['/login'];
      this.router.navigate(link);
    }
  }


  // private getAttachments(): void {
  // 	this.attachmentService
  // 		.getAttachments(this.companyID, this.status, this.pageNumber, this.rowsPerPage)
  // 		.then(result => {
  // 			if (result) {
  //                 this.model = result;
  //                 this.AttachmentCount = this.model[0].AttachmentCount;
  //             }

  // 		});

  // }



}


