import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceProxy, UsersControllerServiceProxy } from './service-proxies/service-proxies';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public jwt = '';
  public userProfile: any = {};

  public isDataupdated = new BehaviorSubject<boolean>(true);

  constructor(
    private usersControllerServiceProxy: UsersControllerServiceProxy,
    private serviceProxy: ServiceProxy
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

  async getLoggedUser(){
    let userName = localStorage.getItem('user_name')!;
    let filter1: string[] = [];
    filter1.push('username||$eq||' + userName);

    return (await this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filter1,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).toPromise()).data[0]
  }
}
