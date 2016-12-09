import { Component, OnInit, ElementRef, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserModel, EventTypeModel } from '../shared/user.model';
import { RoleModel } from '../../role/shared/role.model';


import { CrumbBarComponent } from '../../shared/others/crumb-bar/crumb-bar.component';

import { UserService } from '../../user/shared/user.service';
import { RoleService } from '../../role/shared/role.service';

import { OrderByPipe } from '../../shared/pipe/orderby';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare let jQuery: any;

@Component({
  selector: 'sp-user-entry',
  templateUrl: './user-entry.component.html',
})

export class UserEntryComponent extends BaseComponent implements OnInit, DoCheck {

  private messageHeader: string = 'New Member';
  private userDetail: UserModel;
  private styleLeft: string = '';
  private styleRight: string = '';
  private startTime: string = '';
  private startEnd: string = '';
  private userId: number = 0;
  private selectedDigestArray: any;
  private errorHeader: string = '';
  private regexp1: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  private errors: Array<any> = [];


  private digests: Array<any> = [];
  private roles: Array<RoleModel>;
  private eventTypes: Array<EventTypeModel>;

  constructor(
    localStorageService: LocalStorageService,
    router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService,
    private _elRef: ElementRef,
    public toastr: ToastsManager
  ) {
    super(localStorageService, router);
    this.getSessionDetails();
  }



  ngOnInit() {

  }

  ngDoCheck() {
    jQuery(this._elRef.nativeElement).find('#example_id').ionRangeSlider({
      type: 'double',
      min: 0,
      max: 24,
      from: 0,
      to: 1,
      keyboard: true,
      from_shadow: true
    });

    // let slider = jQuery('#example_id').data('ionRangeSlider');
    // console.log(slider.old_from + '-------' + slider.old_to);
  }


  private getSessionDetails(): void {
    this.user = this.userService.getSessionDetails();
    if (this.user.userId) {
      this.getParameterValues();
    } else {
      let link = ['company'];
      this.router.navigate(link);
    }
  }

  private getParameterValues(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['userId']);
      this.getDigests();
    });
  }

  private getDigests(): void {
    for (let i = 1; i <= 10; i++) {
      let item = { numberOfDigests: 0 };
      item.numberOfDigests = i;
      this.digests.splice(1, 0, item);
    }

    let temp = this.digests;
    this.digests = [];

    temp.map((item: any) => {
      this.digests.push(
        { label: item.numberOfDigests, value: item });
    });

    this.getRoles();
  }

  private getRoles(): void {
    this.roleService.getRoles().then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.roles = result;
      }

      this.getEmailEventTypes();
    });
  }

  private getEmailEventTypes(): void {
    this.userService.getEmailEventTypes().then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
      } else {
        this.eventTypes = result;
      }

      this.showUserData();
    });

  }

  private showUserData() {
    if (this.userId !== 0) {
      this.messageHeader = 'Editing';
    }
    this.getUserById();
  }

  private getUserById(): void {
    this.userService.getUserById(this.userId).then(result => {

      if (result.status === 404) {
        // this.selectedInvoiceDigest.selected = [];
        this.digests.forEach(item => {
          if (item.numberOfDigests === 1) {
            // this.selectedInvoiceDigest.selected = item;
          }
        });
      } else if (result.status === 500) {
      } else {
        this.userDetail = result;
        this.digests.forEach(item => {
          if (item.label === this.userDetail.numberOfDigests) {
            this.selectedDigestArray = item.value;
          }
        });

        // this.errors = [];
        // this.errorHeader = '';

        if (!this.userDetail.IsEdit) {

          // this.router.navigate('user')
          // $location.path('/user/' + this.userID);

          // this.User = [];
          return;
        }

        let tempRoles = [];

        this.roles.forEach(role => {
          let res = this.userDetail.selectedRoles.filter(selectedRole => {
            return role.RoleID === selectedRole.RoleID;
          });
          if (res.length === 0) {
            tempRoles.splice(tempRoles.length, 0, role);
          }
        });

        for (let i = 0; i < this.eventTypes.length; i++) {
          if (this.userDetail.userEmailNotifications != null) {
            this.userDetail.userEmailNotifications.filter(item2 => {
              if (this.eventTypes[i].EventTypeID === item2.EventTypeID) {
                this.eventTypes[i].IsSelected = true;
              }
            });
          }
        }
        this.roles = tempRoles;
        this.changeTime(true, this.userDetail.digestStart, this.userDetail.digestEnd);
      }
    });
  }


  private changeTime(pageLoad, digestStart, digestEnd) {

    if (digestStart && pageLoad) {
      digestStart = parseInt(this.userDetail.digestStart.split(':')[0]) * 60;
    } else if (digestStart) {
      digestStart = digestStart * 60;
    } else {
      digestStart = 0;
    }

    if (digestEnd && pageLoad) {
      digestEnd = parseInt(this.userDetail.digestEnd.split(':')[0]) * 60;
    } else if (digestEnd) {
      digestEnd = digestEnd * 60;
    } else {
      digestEnd = 0;
    }

    let val0 = digestStart,
      val1 = digestEnd,
      minutes0 = val0 % 60,
      hours0 = val0 / 60 % 24,
      minutes1 = val1 % 60,
      hours1 = val1 / 60 % 24;


    this.styleLeft = (hours0 * 4) + '%';
    this.styleRight = (hours1 * 4) + '%';

    this.startTime = this.getTime(hours0, minutes0);
    this.startEnd = this.getTime(hours1, minutes1);

    if (pageLoad) {
      setTimeout(() => {
        if (this.userId === 0) {
          hours1 = 1;
        }
        let slider = jQuery('#example_id').data('ionRangeSlider');
        console.log(slider.old_from + '---' + slider.old_to);

        slider.update({
          from: hours0,
          to: hours1
        });
      }, 10);
    }
  }

  private getTime(hours, minutes) {
    let time = null;
    minutes = minutes + '';
    if (hours < 12) {
      time = 'AM';
    } else {
      time = 'PM';
    }
    if (hours === 0) {
      hours = 12;
    }
    if (hours > 12) {
      hours = hours - 12;
    }
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes + ' ' + time;
  }


  private setSelectedList(item): void {
    let index = this.roles.indexOf(item);
    this.roles.splice(index, 1);
    this.userDetail.selectedRoles.splice(this.userDetail.selectedRoles.length, 0, item);
  }

  private removeFromSelectedList(item): void {
    let index = this.userDetail.selectedRoles.indexOf(item);
    this.userDetail.selectedRoles.splice(index, 1);
    this.roles.splice(this.roles.length, 0, item);
  }


  private savePortalUser(): boolean {
    this.errors = [];
    this.errorHeader = '';

    if (!this.userDetail.userName) {
      let obj = { ErrorName: 'Username cannot be blank' };
      this.errors.splice(this.errors.length, 0, obj);
    }
    if (!this.userDetail.email) {
      let obj = {
        ErrorName: 'Email cannot be blank'
      };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (this.userDetail.email) {
      if (!this.regexp1.test(this.userDetail.email)) {
        // alert('Please Enter Reciever Mail Address With Correct Fromat');
        // messageService.showMsgBox('Invoice', 'Please Enter Reciever Mail Address With Correct Fromat', 'error');
        this.toastr.error('Please Enter Reciever Mail Address With Correct Fromat', 'Oops!');
        return false;
        // }
      }
    }

    if (!this.userDetail.firstName) {
      let obj = { ErrorName: 'Firstname cannot be blank' };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (!this.userDetail.lastName) {
      let obj = { ErrorName: 'Lastname cannot be blank' };
      this.errors.splice(this.errors.length, 0, obj);
    }

    if (this.userDetail.userID) {
      if ((!this.userDetail.password) && (!this.userDetail.confirmPassword)) {
      } else {
        if (this.userDetail.password !== this.userDetail.confirmPassword) {
          let obj = { ErrorName: 'Password and Password confirmation should be same.' };
          this.errors.splice(this.errors.length, 0, obj);
        }
      }
    }

    if (this.userDetail.invoiceDigestEnabled) {
      if (!this.userDetail.digestDayEnabled7 && !this.userDetail.digestDayEnabled1
        && !this.userDetail.digestDayEnabled2 && !this.userDetail.digestDayEnabled3
        && !this.userDetail.digestDayEnabled4 && !this.userDetail.digestDayEnabled5
        && !this.userDetail.digestDayEnabled6) {

        let obj = { ErrorName: 'Please Select At least single digest day' };
        this.errors.splice(this.errors.length, 0, obj);

      }
    }

    if (this.errors.length > 0) {
      // this.showHideErrorLog = { 'display': 'block' };
      // this.displayValue = 'alert alert-danger';
      this.errorHeader = this.errors.length + ' errors prohibited this ' + this.userDetail.type + ' from being saved:';
      // $(window).scrollTop(0);
      return;
    }

    // if (this.currentFile != undefined) {
    //   this.userDetail.imageName = this.currentFile.name;
    //   this.userDetail.imageType = this.currentFile.type;
    // }

    let slider = jQuery('#example_id').data('ionRangeSlider');

    this.changeTime(false, slider.old_from, slider.old_to);

    // this.userDetail.imageSource = this.image_source;
    this.userDetail.digestStart = this.startTime;
    this.userDetail.digestEnd = this.startEnd;

    this.userDetail.userEmailNotifications = [];

    for (let i = 0; i < this.eventTypes.length; i++) {
      let item = {
        EmailEventNotificationID: 0, EventTypeID: 0,
        UserID: 0, EventTypeName: '',
        EventDescription: '',
        IsSelected: false
      };

      if (this.eventTypes[i].IsSelected === true) {
        item.EventTypeID = this.eventTypes[i].EventTypeID;
        this.userDetail.userEmailNotifications.splice(1, 0, item);
      }
    }

    if (!this.selectedDigestArray.numberOfDigests) {
      this.selectedDigestArray.numberOfDigests = 1;
    }

    this.userDetail.numberOfDigests = this.selectedDigestArray.numberOfDigests;

    this.userService.savePortalUser(this.userDetail).then(result => {
      if (result.status === 404) {
      } else if (result.status === 500) {
        this.errors = [];
        this.errorHeader = '';

        if (result.data.ExceptionMessage === 'Invalid Image') {
          let obj = { ErrorName: 'Image type should be in correct format.' };
          this.errors.splice(this.errors.length, 0, obj);
        } else {
          if (result.data.Message === 'An error has occurred.') {
            let obj = { ErrorName: 'User name or email is invalid or already exist' };
            this.errors.splice(this.errors.length, 0, obj);
          } else {
            let obj = { ErrorName: result.data.ExceptionMessage };
            this.errors.splice(this.errors.length, 0, obj);
          }
          // this.showHideErrorLog = { 'display': 'block' };
          // this.displayValue = 'alert alert-danger';
          this.errorHeader = this.errors.length + ' errors prohibited this ' + this.userDetail.type + ' from being saved:';
        }
      } else {
        // this.showHideErrorLog = { 'display': 'none' };
        // this.displayValue = 'none';
        // alert('Member successfully saved.');
        // messageService.showMsgBox('Success', 'Member successfully saved.', 'success');
        this.toastr.success('Member successfully saved.', 'Success!');
        // $location.path('/usersList/-1/-1');
        let link = ['users/-1/-1'];
        this.router.navigate(link);
      }
    });
  }

  private onSelectedDigest(item) {
    console.log(item.numberOfDigests);
  }

}