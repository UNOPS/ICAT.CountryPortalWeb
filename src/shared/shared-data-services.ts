import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class SharedDataService {
  constructor() {}
  //Using any
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private loginMessage = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.loginMessage.asObservable();
  changeMessage(message: string) {
    this.loginMessage.next(message);
  }
}
