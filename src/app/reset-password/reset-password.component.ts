import { Component, OnInit } from '@angular/core';
import { ResetPasswordService } from './shared/reset-password.service';
import { ResetPasswordModel } from './shared/reset-password.model';
import { Router } from '@angular/router';

@Component({
    selector: 'sp-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    private resetPasswordDetail: ResetPasswordModel = new ResetPasswordModel();
    private errors: Array<any> = [];
    private errorHeader: string;
    newPwdFocus: boolean = false;
    confirmPwdFocus: boolean = false;
    constructor(
        private resetPasswordService: ResetPasswordService,
        private router: Router

    ) {
        this.getUserDetail();
    }
    ngOnInit(): void {
    }

    private getUserDetail(): void {
        let resetPasswordToken = window.location.href.split('?')[1];
        alert(resetPasswordToken);
        this.resetPasswordService.getUserDetail(resetPasswordToken).then((result) => {
            this.resetPasswordDetail = result;
            if (this.resetPasswordDetail.UserID === 0) {
                //  $timeout(function () {
                let link = ['/login'];
                this.router.navigate(link);
                // }, 7000);
            }
        });
    }

    private resetPassword(): void {

        this.errors = new Array<any>();
        this.errorHeader = '';

        if (this.resetPasswordDetail.NewPassword === '' || this.resetPasswordDetail.NewPassword == null) {
            let err = { ErrorName: 'New Password can' + 't be blank' };
            this.errors.splice(this.errors.length, 0, err);
            this.newPwdFocus = true;
        }
        if (this.resetPasswordDetail.ConfirmPassword === '' || this.resetPasswordDetail.ConfirmPassword == null) {
            let err = { ErrorName: 'Confirm Password can' + 't be blank' };
            this.errors.splice(this.errors.length, 0, err);
            if (this.resetPasswordDetail.NewPassword === '' || this.resetPasswordDetail.NewPassword == null) {
                this.newPwdFocus = true;
            } else {
                this.confirmPwdFocus = true;
            }
        }
        if (this.resetPasswordDetail.ConfirmPassword !== this.resetPasswordDetail.NewPassword) {
            let err = { ErrorName: 'Confirm Password and New Password should be same.' };
            this.errors.splice(this.errors.length, 0, err);
            this.confirmPwdFocus = true;
        }

        if (this.errors.length > 0) {
            this.errorHeader = this.errors.length + ' errors prohibited this ' + this.resetPasswordDetail.type + ' from being saved:';
            return;
        }

        this.resetPasswordService.resetPassword(this.resetPasswordDetail).then((result) => {
            if (result === false || result === 'false') {
                let err = { ErrorName: 'Please create login for first time use.' };
                this.errors.splice(this.errors.length, 0, err);
            } else {
                alert('Password successfully reset.');
                let link = ['/login'];
                this.router.navigate(link);
                //  window.location.href = '/#/login';

            }
        });
    }

}



