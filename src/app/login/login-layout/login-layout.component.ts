import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginLayoutService } from './login-layout.service';
@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
})
export class LoginLayoutComponent implements OnInit {
  showLoginForm = true;
  showForgotPassword: boolean;
  showSetPassword: boolean;

  isLoggedIn = false;
  hideSideBar = true;

  constructor(
    private logLayoutService: LoginLayoutService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.logLayoutService.resetLoginEmail = params['email'];
      this.logLayoutService.resetToken = params['token'];
      this.logLayoutService.showLoginForm.next(true);
      this.logLayoutService.showForgotPassword.next(false);
    });

    this.logLayoutService.showLoginForm.subscribe((showLoginForm) => {
      this.showLoginForm = showLoginForm;
    });
    this.logLayoutService.showForgotPassword.subscribe((showForgotPassword) => {
      this.showForgotPassword = showForgotPassword;
    });

    this.logLayoutService.showSetPassword.subscribe((showSetPassword) => {
      this.showSetPassword = showSetPassword;
    });
  }

  toLanding() {
    this.router.navigate(['/landing-page']);
  }
}
