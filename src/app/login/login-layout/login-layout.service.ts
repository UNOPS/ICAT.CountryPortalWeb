import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AuthCredentialDto,
  ResetPassword,
} from 'shared/service-proxies/service-proxies';

@Injectable()
export class LoginLayoutService {
  public showLoginForm = new BehaviorSubject<boolean>(true);
  public showForgotPassword = new BehaviorSubject<boolean>(false);
  public showSetPassword = new BehaviorSubject<boolean>(false);
  public authCredentialDot = new AuthCredentialDto();
  public resetPasswordDto = new ResetPassword();
  public resetLoginEmail: string;
  public resetToken: string;

  constructor() {
    this.showLoginForm.next(true);
  }
  toggleLoginForm(
    showLoginForm: any,
    showForgotPassword: any,
    showSetPassword: any
  ) {
    // used show hide login and forgot password forms
    this.showForgotPassword.next(showForgotPassword);
    this.showLoginForm.next(showLoginForm);
    //this.showSetPassword.next(showSetPassword);
  }
}
