import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersControllerServiceProxy } from './service-proxies/service-proxies';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public jwt: string = '';
  public userProfile: any = {};

  public isDataupdated = new BehaviorSubject<boolean>(true);

  constructor(
    private usersControllerServiceProxy: UsersControllerServiceProxy
  ) {
    //this.update();

    this.userProfile.username = localStorage.getItem('user_name'); // get the username
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