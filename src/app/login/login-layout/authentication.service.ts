import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public isLoggedIn = new BehaviorSubject<boolean>(true);
  public hideSidebar = new BehaviorSubject<boolean>(false);

  authenticate(isLoggedIn: boolean, hideSidebar: boolean) {
    console.log(isLoggedIn);
    this.isLoggedIn.next(isLoggedIn);
    this.hideSidebar.next(hideSidebar);
  }
}
