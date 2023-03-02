import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  AuthControllerServiceProxy,
  ForgotPasswordDto,
} from 'shared/service-proxies/service-proxies';
import { LoginLayoutService } from '../login-layout/login-layout.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('fFP') fFP: NgForm;

  showLoginForm = false;
  showForgotPassword = true;
  showSetPassword = false;

  isSubmitLogin: boolean;
  isInvalidCredential: boolean;
  email: string;
  jobDone: boolean;

  constructor(
    private logiLayoutService: LoginLayoutService,
    private appControllServiceProxy: AuthControllerServiceProxy,
  ) {}

  ngOnInit(): void {}

  showLogin() {
    this.showLoginForm = true;
    this.showForgotPassword = false;
    this.showSetPassword = false;
    this.logiLayoutService.toggleLoginForm(
      this.showLoginForm,
      this.showForgotPassword,
      this.showSetPassword,
    );
  }

  showSetPasswordForm() {
    this.showLoginForm = false;
    this.showForgotPassword = false;
    this.showSetPassword = true;
    this.logiLayoutService.toggleLoginForm(
      this.showLoginForm,
      this.showForgotPassword,
      this.showSetPassword,
    );
  }

  resetPassword() {
    this.isSubmitLogin = true;
    if (!this.fFP.valid) {
      return;
    }
    const request = new ForgotPasswordDto();
    request.email = this.email;
    this.jobDone = false;
    this.appControllServiceProxy.forgotPassword(request).subscribe(
      (res) => {
        this.jobDone = true;
      },
      (error) => {
        this.jobDone = true;
      },
    );
  }
}
