import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LoginModel } from './shared/login.model';
import { UserService } from '../user/shared/user.service';
import { AuthService } from '../shared/services/otherServices/auth.service';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {PubSubService} from '../interceptor/pub-service';

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
    router: Router,
    private location: Location,
    private toastr: ToastsManager,
     public pubsub: PubSubService) {
    super(localStorageService, router);
    this.loginModel = new LoginModel();

    console.log('my test module');
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
    if (this.loginModel.email === '') {
      this.message = 'Please enter your email to reset your password';
      this.emailFocus = true;
      return;
    }
    // messageService.showPleaseWait();
    this.userService.sendResetPasswordEmail(this.loginModel.email).then((result) => {
      // messageService.hidePleaseWait();
      if (result.status === 404 || result.status === 500) {
        this.message = 'Email not found, Please enter correct email';
      } else {
        this.toastr.success('Reset Password link successfully send to your email ' + this.loginModel.email, 'Success!');
        // alert('Reset Password link successfully send to your email ' + $scope.email);
        // messageService.showMsgBox('Success', 'Reset Password link successfully send to your email ' + this.loginModel.email, 'success');

        this.loginAccount();
      }
    });
  }

  private login(): void {
    // let self = this;
    // messageService.showPleaseWait();
    this.authService.login(this.loginModel).then((response) => {
      // console.log(self.loginModel);
      this.localStorageService.set('authorization', 'Bearer ' + response.access_token);
      let isResetPasswordRequired = JSON.parse(response.IsResetPasswordRequired);
      this.localStorageService.set('sessionData',
        {
          AccountID: response.AccountID, ImageName: response.ImageName,
          IsSuperUser: JSON.parse(response.IsSuperUser), userId: (response.userId),
          Name: response.Name, userName: response.userName,
          IsResetPasswordRequired: JSON.parse(response.IsResetPasswordRequired)
        });

        this.localStorageService.set('dashboardStateData' ,{ 
          companyId: 0,
          currentDashboardTabState: 1
          , isTabApproveInvoice: false
        });

         this.localStorageService.set('routeData' ,{ 
          prevoiusRoute: 'login',
        });

      if (isResetPasswordRequired) {

        let link = ['/resetpassword'];
        this.router.navigate(link);

      } else {
        this.userService.updateUserDetail(this.loginModel.userName).then((result) => {
          this.location.replaceState('/dashboard');
          window.location.reload();
        });
      }
    },
      (err) => {
        // messageService.hidePleaseWait();
        this.message = err.error_description;
        if (this.message === undefined) {
          this.message = 'Login failed for this user';
        }
      });
  }
}
