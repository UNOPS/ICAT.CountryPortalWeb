import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleGuardService } from 'app/auth/role-guard.service';
import { AppService } from 'shared/AppService';
import {
  AuthControllerServiceProxy,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { SharedDataService } from 'shared/shared-data-services';
import { AuthenticationService } from '../../login/login-layout/authentication.service';
import { LoginLayoutService } from '../login-layout/login-layout.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @ViewChild('fLogin') fLogin: NgForm;

  showLoginForm = true;
  showForgotPassword = false;
  showSetPassword = false;
  display: boolean = false;
  showPassword: boolean;
  showPasswordOnPress: boolean;

  isLoggedIn = false;
  hideSideBar = true;

  isSubmitLogin: boolean;
  isInvalidCredential: boolean;
  loginError: string = '';
  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };

  constructor(
    public logiLayoutService: LoginLayoutService,
    private _loginApiService: UsersControllerServiceProxy,
    private appControllServiceProxy: AuthControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private WMServiceService: AppService,
    private roleGuardService: RoleGuardService,
    private sharedDataService: SharedDataService
  ) {
    console.log('LoginFormComponent ctor');
  }

  ngOnInit(): void {
    console.log('LoginFormComponent ngOnInit');
    // this._loginApiService.findAll().subscribe(result => {
    //   // console.log(result);
    // });

    this.authenticationService.authenticate(false, true);

    // this._investorsControllerServiceProxy.findAll().subscribe(result => {
    //   console.log(result);
    // });
  }

  showPasswordResetForm() {
    this.showLoginForm = false;
    this.showForgotPassword = true;
    this.showSetPassword = false;
    this.logiLayoutService.toggleLoginForm(
      this.showLoginForm,
      this.showForgotPassword,
      this.showSetPassword
    ); // call login layout service
  }

  resetError() {
    this.isInvalidCredential = false;
  }

  login() {
    // this.display = true;
    this.isSubmitLogin = true;
    if (!this.fLogin.valid) {
      return;
    }
    this.appControllServiceProxy
      .login(this.logiLayoutService.authCredentialDot)
      .subscribe(
        (token) => {
          console.log(token);
          if (token && token.access_token) {
            this.isInvalidCredential = false;

            this.isLoggedIn = true;
            this.hideSideBar = false;
            this.WMServiceService.steToken(token.access_token);
            localStorage.setItem('access_token', token.access_token); // store the tocken
            localStorage.setItem(
              'user_name',
              this.logiLayoutService.authCredentialDot.username
            ); // store the username
            this.WMServiceService.userProfile = {
              username: this.logiLayoutService.authCredentialDot.username,
            };

            //this.authenticationService.authenticate(this.isLoggedIn, this.hideSideBar);

            // if (this.roleGuardService.checkRoles(['Institution Admin'])) {

            //   this.userRole = this.userRoles[7];
            //   this.router.navigate(['/ia-dashboard']);

            // }

            //this.router.navigate(['/dashboard']);

            // this.appControllServiceProxy.getProfile().subscribe(res=> {

            // });

            if (this.roleGuardService.checkRoles(['Country Admin'])) {
              this.userRole = this.userRoles[0];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['Verifier'])) {
              this.userRole = this.userRoles[1];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['Sector Admin'])) {
              this.userRole = this.userRoles[2];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['MRV Admin'])) {
              this.userRole = this.userRoles[3];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['Technical Team'])) {
              this.userRole = this.userRoles[4];
              this.router.navigate(['/dashboard']);
            } else if (
              this.roleGuardService.checkRoles(['Data Collection Team'])
            ) {
              this.userRole = this.userRoles[5];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['QC Team'])) {
              this.userRole = this.userRoles[6];
              this.router.navigate(['/dashboard']);
            } else if (
              this.roleGuardService.checkRoles(['Institution Admin'])
            ) {
              this.userRole = this.userRoles[7];
              this.router.navigate(['/ia-dashboard']);
            } else if (
              this.roleGuardService.checkRoles(['Data Entry Operator'])
            ) {
              this.userRole = this.userRoles[8];
              this.router.navigate(['/ia-dashboard']);
            }
            //Set value in AppComponent
            this.sharedDataService.changeMessage('login_success');
          } else {
            this.isInvalidCredential = true;
            this.loginError = token.error
          }
        },
        (error) => {
          console.log(error);
          this.isInvalidCredential = true;
        }
      );
  }
}
