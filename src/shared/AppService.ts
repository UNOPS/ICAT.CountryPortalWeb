import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersControllerServiceProxy } from './service-proxies/service-proxies';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public jwt = '';
  public userProfile: any = {};

  public isDataupdated = new BehaviorSubject<boolean>(true);

  constructor(
    private usersControllerServiceProxy: UsersControllerServiceProxy,
  ) {
    this.userProfile.username = localStorage.getItem('user_name');
  }

  update() {
    this.isDataupdated.next(true);
  }

  steToken(tocken: string): void {
    this.jwt = tocken;
  }

  getToken(): string {
    return this.jwt;
  }
}
