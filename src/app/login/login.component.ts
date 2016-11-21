import { Component, OnInit } from '@angular/core';
import { LoginModel } from './shared/login.model';
import { UserService } from '../user/shared/user.service';
import { AuthService } from '../shared/services/otherServices/auth.service';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'sp-login',
  templateUrl: './login.component.html'
})

export class LoginComponent extends BaseComponent implements OnInit {

  private isLoginDisplay: boolean = true;
  private emailFocus: boolean = false;
  private userNameFocus: boolean = false;
  private message: string = '';
  private loginModel: LoginModel;

  constructor(private userService: UserService,
    private authService: AuthService,
    localStorageService: LocalStorageService,
    router: Router) {
    super(localStorageService, router);
    this.loginModel = new LoginModel();
  }

  ngOnInit() {
  }

  private forgotPassword(): void {
    this.isLoginDisplay = false;
    this.emailFocus = true;
  }

  private loginAccount(): void {
    this.isLoginDisplay = true;
    this.message = '';
    this.loginModel.email = '';
    this.userNameFocus = true;
  }

  private getResetLink(): void {
    if (this.loginModel.email == '') {
      this.message = 'Please enter your email to reset your password';
      this.emailFocus = true;
      return;
    }
    // messageService.showPleaseWait();
    this.userService.sendResetPasswordEmail(this.loginModel.email).then((result) => {
      // messageService.hidePleaseWait();
      if (result.status == 404 || result.status == 500) {
        this.message = 'Email not found, Please enter correct email';
      }
      else {
        // alert("Reset Password link successfully send to your email " + $scope.email);
        // messageService.showMsgBox("Success", "Reset Password link successfully send to your email " + this.loginModel.email, "success");

        this.loginAccount();
      }
    });
  }

  private login(): void {
    // let self = this;
    // messageService.showPleaseWait();
    this.authService.login(this.loginModel).then((response) => {
      // console.log(self.loginModel);
      if (this.loginModel.useRefreshTokens) {
        this.localStorageService.set('authorization', 'Bearer ' + response.access_token);
        //this.localStorageService.set('authorization', { token: response.access_token, userName: this.loginModel.userName, refreshToken: response.refresh_token, useRefreshTokens: true, IsResetPasswordRequired: JSON.parse(response.IsResetPasswordRequired) });
        this.localStorageService.set('sessionData', { AccountID: response.AccountID, ImageName: response.ImageName, IsSuperUser: JSON.parse(response.IsSuperUser), userId: (response.userId), Name: response.Name, userName: response.userName, IsResetPasswordRequired: JSON.parse(response.IsResetPasswordRequired) });
      }
      else {
        this.localStorageService.set('authorization', 'Bearer ' + response.access_token);
        //this.localStorageService.set('authorization', { token: response.access_token, userName: this.loginModel.userName, refreshToken: "", useRefreshTokens: false, isResetPasswordRequired: response.isResetPasswordRequired });
        this.localStorageService.set('sessionData', { AccountID: "", ImageName: "", IsSuperUser: "", userId: "", Name: "", userName: "" });
      }

      this.sessionDetails = this.userService.getSessionDetails();
      if (this.sessionDetails.userId != null && this.sessionDetails.userId != undefined) {
        if (this.sessionDetails.IsResetPasswordRequired == true) {
          // messageService.hidePleaseWait();
          let link = ['/resetpassword'];
          this.router.navigate(link);
          // $location.path('resetpassword');
        }
        else {
          this.userService.updateUserDetail(this.loginModel.userName).then((result) => {
            // messageService.hidePleaseWait();
            let link = ['/company'];
            this.router.navigate(link);
          });
        }
      }
    },
      (err) => {
        // messageService.hidePleaseWait();
        this.message = err.error_description;

        if (this.message == undefined) {
          this.message = 'Login failed for this user';
        }
      });
  }

}
